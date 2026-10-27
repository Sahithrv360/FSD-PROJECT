import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookingTable } from '../components/BookingTable';
import { Loading, ErrorMessage } from '../components/Feedback';

export const ManagerDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('reservations'); // 'reservations', 'tables', 'analytics'
  const [dashboardData, setDashboardData] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Add Table state
  const [newTableNum, setNewTableNum] = useState('');
  const [newTableCap, setNewTableCap] = useState(2);
  const [newTableArea, setNewTableArea] = useState('Main Dining Room');
  const [addingTable, setAddingTable] = useState(false);

  // Loaders & feedback
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // 1. Initial Load: Dashboard & Reports
  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, repRes] = await Promise.all([
        api.manager.getDashboard(),
        api.manager.getReports()
      ]);

      if (dashRes.success) {
        setDashboardData(dashRes.data);
        if (dashRes.data.managedRestaurants?.length > 0) {
          const firstRestId = dashRes.data.managedRestaurants[0]._id;
          setSelectedRestaurantId(firstRestId);
        }
      }

      if (repRes.success) {
        setReportsData(repRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load manager dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // 2. Fetch Reservations whenever filters change
  const fetchReservations = async () => {
    try {
      const res = await api.manager.getReservations({
        restaurantId: selectedRestaurantId,
        status: statusFilter,
        date: dateFilter
      });
      if (res.success) {
        setReservations(res.data);
      }
    } catch (err) {
      console.error('[Manager Reservations Error]:', err);
    }
  };

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchReservations();
    }
  }, [selectedRestaurantId, statusFilter, dateFilter]);

  // 3. Fetch Tables for Table Management tab
  const fetchTables = async () => {
    if (!selectedRestaurantId) return;
    try {
      const res = await api.tables.getByRestaurant(selectedRestaurantId);
      if (res.success) {
        setTables(res.data);
      }
    } catch (err) {
      console.error('[Manager Tables Error]:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'tables' && selectedRestaurantId) {
      fetchTables();
    }
  }, [activeTab, selectedRestaurantId]);

  // Status Change handler
  const handleStatusChange = async (reservationId, newStatus) => {
    setActionLoadingId(reservationId);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.manager.updateStatus(reservationId, newStatus);
      if (res.success) {
        setSuccessMsg(`Reservation updated to '${newStatus}'`);
        await fetchReservations();
        // Refresh aggregation reports
        const repRes = await api.manager.getReports();
        if (repRes.success) setReportsData(repRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to update reservation status');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Add Table handler
  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableNum || !newTableCap) return;

    setAddingTable(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await api.tables.add(selectedRestaurantId, {
        tableNumber: newTableNum,
        capacity: Number(newTableCap),
        area: newTableArea
      });

      if (res.success) {
        setSuccessMsg(`Table #${newTableNum} added successfully!`);
        setNewTableNum('');
        setNewTableCap(2);
        await fetchTables();
      }
    } catch (err) {
      setError(err.message || 'Failed to add table');
    } finally {
      setAddingTable(false);
    }
  };

  // Toggle Table Active
  const handleToggleTable = async (table) => {
    try {
      const res = await api.tables.update(table._id, {
        isActive: !table.isActive
      });
      if (res.success) {
        await fetchTables();
      }
    } catch (err) {
      setError(err.message || 'Failed to toggle table status');
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <Loading message="Loading manager management dashboard..." />
      </div>
    );
  }

  const currentRestaurant = dashboardData?.managedRestaurants?.find(
    (r) => r._id === selectedRestaurantId
  );

  return (
    <div className="py-4">
      <div className="container">
        {/* Header with Venue Selector */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div>
            <span className="badge badge-gold mb-1">Manager Floor Operations</span>
            <h1 className="font-serif fs-2 mb-0">Restaurant Command Center</h1>
            <p className="text-muted small mb-0">
              Real-time reservations, dining floor allocations, and MongoDB aggregation analytics.
            </p>
          </div>

          {dashboardData?.managedRestaurants?.length > 1 && (
            <div className="mt-3 mt-md-0">
              <label className="form-label small text-muted mb-1">Select Managed Venue:</label>
              <select
                className="form-select font-serif"
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
              >
                {dashboardData.managedRestaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.address?.city})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && <ErrorMessage message={error} />}
        {successMsg && (
          <div className="alert alert-success py-2 small d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-check-circle-fill"></i>
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-sm-6">
            <div className="p-3 bg-white rounded-3 border shadow-sm h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small text-uppercase fw-semibold">Today's Bookings</div>
                  <div className="fs-2 font-serif fw-bold" style={{ color: 'var(--burgundy)' }}>
                    {dashboardData?.todayReservationsCount || 0}
                  </div>
                </div>
                <div className="p-3 rounded-circle bg-light text-burgundy fs-4">
                  <i className="bi bi-calendar-check"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="p-3 bg-white rounded-3 border shadow-sm h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small text-uppercase fw-semibold">Pending Requests</div>
                  <div className="fs-2 font-serif fw-bold text-warning">
                    {dashboardData?.pendingCount || 0}
                  </div>
                </div>
                <div className="p-3 rounded-circle bg-light text-warning fs-4">
                  <i className="bi bi-hourglass-split"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="p-3 bg-white rounded-3 border shadow-sm h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small text-uppercase fw-semibold">Active Tables</div>
                  <div className="fs-2 font-serif fw-bold" style={{ color: 'var(--gold-hover)' }}>
                    {dashboardData?.totalTables || 0}
                  </div>
                </div>
                <div className="p-3 rounded-circle bg-light text-gold fs-4">
                  <i className="bi bi-grid-3x3"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="p-3 bg-white rounded-3 border shadow-sm h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small text-uppercase fw-semibold">Venue Selected</div>
                  <div className="fs-5 font-serif fw-bold text-truncate" style={{ maxWidth: '140px' }}>
                    {currentRestaurant?.name || "L'Étoile"}
                  </div>
                  <div className="small text-muted">{currentRestaurant?.cuisine}</div>
                </div>
                <div className="p-3 rounded-circle bg-light text-success fs-4">
                  <i className="bi bi-shop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <ul className="nav nav-pills mb-4 border-bottom pb-2 gap-2">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'reservations' ? 'active bg-dark' : 'text-dark'}`}
              onClick={() => setActiveTab('reservations')}
            >
              <i className="bi bi-table me-1"></i> Reservations
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'tables' ? 'active bg-dark' : 'text-dark'}`}
              onClick={() => setActiveTab('tables')}
            >
              <i className="bi bi-layout-three-columns me-1"></i> Table Floorplan ({tables.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'analytics' ? 'active bg-dark' : 'text-dark'}`}
              onClick={() => setActiveTab('analytics')}
            >
              <i className="bi bi-bar-chart-line me-1"></i> Aggregation Analytics
            </button>
          </li>
        </ul>

        {/* TAB 1: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div>
            {/* Filter Bar */}
            <div className="bg-white p-3 rounded-3 border mb-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="small fw-bold text-muted">Filter Status:</span>
                {['All', 'confirmed', 'seated', 'completed', 'pending', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    className={`btn btn-sm text-capitalize ${statusFilter === st ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center gap-2">
                <label className="small fw-semibold text-muted text-nowrap">Filter Date:</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                {dateFilter && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setDateFilter('')}
                    title="Clear date filter"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            <BookingTable
              reservations={reservations}
              isManagerView={true}
              onStatusChange={handleStatusChange}
              actionLoadingId={actionLoadingId}
            />
          </div>
        )}

        {/* TAB 2: TABLE FLOORPLAN MANAGEMENT */}
        {activeTab === 'tables' && (
          <div>
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="bg-white rounded-3 border p-4 shadow-sm">
                  <h4 className="font-serif fs-4 mb-3">Floor Plan & Active Tables</h4>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light text-muted small">
                        <tr>
                          <th>Table #</th>
                          <th>Seating Area</th>
                          <th>Capacity</th>
                          <th>Status</th>
                          <th className="text-end">Toggle Active</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        {tables.map((tbl) => (
                          <tr key={tbl._id}>
                            <td className="fw-bold">Table #{tbl.tableNumber}</td>
                            <td>{tbl.area}</td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {tbl.capacity} Guests
                              </span>
                            </td>
                            <td>
                              {tbl.isActive ? (
                                <span className="badge bg-success-subtle text-success border border-success-subtle">
                                  Active
                                </span>
                              ) : (
                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="text-end">
                              <button
                                className={`btn btn-sm ${tbl.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                onClick={() => handleToggleTable(tbl)}
                              >
                                {tbl.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Add Table Form */}
              <div className="col-lg-4">
                <div className="bg-white rounded-3 border p-4 shadow-sm">
                  <h4 className="font-serif fs-5 mb-3">Add Dining Table</h4>
                  <form onSubmit={handleAddTable}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Table Identifier</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. T8 or VIP-1"
                        value={newTableNum}
                        onChange={(e) => setNewTableNum(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted">Seating Capacity</label>
                      <select
                        className="form-select"
                        value={newTableCap}
                        onChange={(e) => setNewTableCap(Number(e.target.value))}
                      >
                        {[2, 4, 6, 8, 10, 12].map((num) => (
                          <option key={num} value={num}>
                            {num} Guests
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small fw-semibold text-muted">Dining Section Area</label>
                      <select
                        className="form-select"
                        value={newTableArea}
                        onChange={(e) => setNewTableArea(e.target.value)}
                      >
                        <option value="Main Dining Room">Main Dining Room</option>
                        <option value="Window View">Window View</option>
                        <option value="Terrace & Patio">Terrace & Patio</option>
                        <option value="Private Dining / Lounge">Private Dining / Lounge</option>
                        <option value="Bar Counter">Bar Counter</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={addingTable}
                      className="btn btn-burgundy w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    >
                      {addingTable ? (
                        <span>Adding Table...</span>
                      ) : (
                        <>
                          <i className="bi bi-plus-lg"></i>
                          <span>Add to Floorplan</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MONGODB AGGREGATION ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <div className="row g-4">
              {/* Aggregation 1: Status Breakdown */}
              <div className="col-lg-6">
                <div className="bg-white p-4 rounded-3 border shadow-sm h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="font-serif mb-0">Reservations by Status</h5>
                    <span className="badge badge-gold">MongoDB $group</span>
                  </div>
                  <p className="text-muted small">
                    Aggregated count and guest volume calculated in real-time via MongoDB aggregation pipeline.
                  </p>

                  <div className="d-flex flex-column gap-3 mt-3">
                    {reportsData?.statusSummary?.map((item) => (
                      <div key={item._id} className="p-3 bg-light rounded-2 border">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-semibold text-capitalize text-dark">
                            {item._id}
                          </span>
                          <span className="badge bg-dark">
                            {item.count} Bookings
                          </span>
                        </div>
                        <div className="small text-muted d-flex justify-content-between">
                          <span>Total Guests: {item.totalGuests}</span>
                          <span>Share: {item.count} reservations</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aggregation 2: Daily Bookings */}
              <div className="col-lg-6">
                <div className="bg-white p-4 rounded-3 border shadow-sm h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="font-serif mb-0">Daily Booking Trends</h5>
                    <span className="badge badge-gold">Time-Series Aggregation</span>
                  </div>
                  <p className="text-muted small">
                    Daily reservation volume and confirmed diner headcounts.
                  </p>

                  <div className="d-flex flex-column gap-2 mt-3" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {reportsData?.dailySummary?.map((d) => (
                      <div key={d._id} className="p-3 bg-light rounded-2 border d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-semibold text-dark">{d._id}</div>
                          <div className="small text-muted">
                            Guests: {d.totalGuests} • Confirmed: {d.confirmedBookings}
                          </div>
                        </div>
                        <span className="fs-5 font-serif fw-bold text-burgundy">
                          {d.totalBookings}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
