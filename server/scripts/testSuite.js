const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 =========================================================');
  console.log('🧪 Starting TableReserve Full-Stack API Automated Test Suite');
  console.log('🧪 =========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extra = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${extra}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'online', '1. Server Health Check Endpoint');

    // 2. Customer Login
    const loginCustRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@tablereserve.com', password: 'Customer@123' })
    });
    const loginCustJson = await loginCustRes.json();
    assert(loginCustRes.status === 200 && loginCustJson.token, '2. Customer Login & JWT issuance');
    const customerToken = loginCustJson.token;

    // 3. Manager Login
    const loginMgrRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'manager@tablereserve.com', password: 'Manager@123' })
    });
    const loginMgrJson = await loginMgrRes.json();
    assert(loginMgrRes.status === 200 && loginMgrJson.token && loginMgrJson.user.role === 'manager', '3. Manager Login & Role Authorization');
    const managerToken = loginMgrJson.token;

    // 4. Auth Me Check
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.user.email === 'customer@tablereserve.com', '4. Token Verification via /api/auth/me');

    // 5. Get Restaurants Listing
    const restRes = await fetch(`${BASE_URL}/restaurants`);
    const restJson = await restRes.json();
    assert(restRes.status === 200 && restJson.count >= 4, `5. Restaurant Listing (Count: ${restJson.count})`);
    const testRestaurant = restJson.data[0];

    // 6. Filter Restaurants by Cuisine
    const filterRes = await fetch(`${BASE_URL}/restaurants?cuisine=French Contemporary`);
    const filterJson = await filterRes.json();
    assert(filterRes.status === 200 && filterJson.data.length > 0, '6. Cuisine Filtering (/restaurants?cuisine=French Contemporary)');

    // 7. Get Restaurant by ID with Tables
    const detailRes = await fetch(`${BASE_URL}/restaurants/${testRestaurant._id}`);
    const detailJson = await detailRes.json();
    assert(detailRes.status === 200 && detailJson.data.tables.length > 0, `7. Restaurant Details & Tables (Table count: ${detailJson.data.tables?.length})`);
    const testTable = detailJson.data.tables[0];

    // 8. Slot Availability Check
    const availRes = await fetch(`${BASE_URL}/restaurants/${testRestaurant._id}/availability?date=2026-11-15&time=19:00&partySize=2`);
    const availJson = await availRes.json();
    assert(availRes.status === 200 && availJson.data.slots.length > 0, '8. Live Slot Availability Pipeline');

    // 9. Create Reservation (Valid)
    const createRes = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        restaurantId: testRestaurant._id,
        tableId: testTable._id,
        date: '2026-11-15',
        startTime: '19:00',
        partySize: 2,
        specialRequests: 'Window seat if available'
      })
    });
    const createJson = await createRes.json();
    assert(createRes.status === 201 && createJson.data._id, '9. Reservation Booking Creation (Status 201)');
    const createdReservationId = createJson.data._id;

    // 10. Booking Conflict Test (HTTP 409 Conflict)
    // Attempt to book the EXACT SAME table at overlapping time slot
    const conflictRes = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        restaurantId: testRestaurant._id,
        tableId: testTable._id,
        date: '2026-11-15',
        startTime: '19:30', // Overlaps with 19:00-20:30!
        partySize: 2,
        specialRequests: 'Conflicting request attempt'
      })
    });
    const conflictJson = await conflictRes.json();
    assert(conflictRes.status === 409 && conflictJson.conflict === true, '10. Overlapping Reservation Conflict Rejection (Status 409 Conflict)', JSON.stringify(conflictJson));

    // 11. Customer's Reservations
    const myBookingsRes = await fetch(`${BASE_URL}/reservations/my`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const myBookingsJson = await myBookingsRes.json();
    assert(myBookingsRes.status === 200 && myBookingsJson.count > 0, `11. Customer Reservation History (Total: ${myBookingsJson.count})`);

    // 12. Manager Dashboard Metrics
    const mgrDashRes = await fetch(`${BASE_URL}/manager/dashboard`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    const mgrDashJson = await mgrDashRes.json();
    assert(mgrDashRes.status === 200 && mgrDashJson.data.managedRestaurants.length > 0, '12. Manager Dashboard Metrics Retrieval');

    // 13. Manager MongoDB Aggregation Reports
    const repRes = await fetch(`${BASE_URL}/manager/reports`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    const repJson = await repRes.json();
    assert(
      repRes.status === 200 &&
      Array.isArray(repJson.data.statusSummary) &&
      Array.isArray(repJson.data.dailySummary),
      '13. Manager Real MongoDB Aggregation Reports Pipeline'
    );

    // 14. Manager Status Update (Mark Seated)
    const statusRes = await fetch(`${BASE_URL}/manager/reservations/${createdReservationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${managerToken}`
      },
      body: JSON.stringify({ status: 'seated' })
    });
    const statusJson = await statusRes.json();
    assert(statusRes.status === 200 && statusJson.data.status === 'seated', "14. Manager Status Transition to 'seated'");

    // 15. Unauthorized Role Access Rejection (Customer accessing manager endpoint -> 403 Forbidden)
    const unauthRes = await fetch(`${BASE_URL}/manager/dashboard`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(unauthRes.status === 403, '15. Unauthorized Access Protection (Customer blocked with HTTP 403)');

    // 16. Cancellation of Reservation
    const cancelRes = await fetch(`${BASE_URL}/reservations/${createdReservationId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const cancelJson = await cancelRes.json();
    assert(cancelRes.status === 200 && cancelJson.data.status === 'cancelled', '16. Customer Reservation Cancellation');

    // 17. Re-booking Released Slot After Cancellation (Conflict should no longer exist!)
    const rebookRes = await fetch(`${BASE_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        restaurantId: testRestaurant._id,
        tableId: testTable._id,
        date: '2026-11-15',
        startTime: '19:00',
        partySize: 2
      })
    });
    assert(rebookRes.status === 201, '17. Table Release Verification: Freed slot successfully bookable');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n=========================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=========================================================\n');

  if (failed === 0) {
    console.log('🎉 ALL AUTOMATED REST API TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
