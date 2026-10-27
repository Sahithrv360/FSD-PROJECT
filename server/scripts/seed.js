import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tablereserve';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections for idempotent re-seed...');
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      Table.deleteMany({}),
      Reservation.deleteMany({})
    ]);

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const managerHash = await bcrypt.hash('Manager@123', salt);
    const customerHash = await bcrypt.hash('Customer@123', salt);
    const adminHash = await bcrypt.hash('Admin@123', salt);

    const [manager, customer, admin] = await User.create([
      {
        name: 'Chef Alessandro Rossi',
        email: 'manager@tablereserve.com',
        passwordHash: managerHash,
        role: 'manager'
      },
      {
        name: 'Eleanor Vance',
        email: 'customer@tablereserve.com',
        passwordHash: customerHash,
        role: 'customer'
      },
      {
        name: 'System Administrator',
        email: 'admin@tablereserve.com',
        passwordHash: adminHash,
        role: 'admin'
      }
    ]);

    console.log('[Seed] Creating premium restaurants...');
    const restaurantsData = [
      {
        name: "L'Étoile Royale",
        description: "Michelin-inspired French contemporary dining with an exquisite seasonal tasting menu, artisanal sommelier pairings, and an enchanting glass skylight atrium.",
        cuisine: "French Contemporary",
        priceLevel: "$$$$",
        address: {
          street: "42 Grand Promenade, 5th Avenue District",
          city: "New York",
          state: "NY",
          zipCode: "10022"
        },
        phone: "+1 (212) 555-8901",
        images: [
          "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
        ],
        openingHours: { open: "12:00", close: "23:00" },
        rating: 4.9,
        features: ["Sommelier Pairing", "Valet Parking", "Skylight Dining", "Dress Code Enforced"],
        managerId: manager._id
      },
      {
        name: "Aura Modern Indian",
        description: "Sublime regional Indian culinary heritage reimagined through avant-garde techniques, slow-simmered Awadhi gravies, and royal tandoor delicacies.",
        cuisine: "Progressive Indian",
        priceLevel: "$$$",
        address: {
          street: "18 Heritage Court, Marina Bay",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105"
        },
        phone: "+1 (415) 555-7234",
        images: [
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
        ],
        openingHours: { open: "12:00", close: "22:30" },
        rating: 4.8,
        features: ["Chef Tasting Menu", "Cocktail Bar", "Private Dining", "Outdoor Patio"],
        managerId: manager._id
      },
      {
        name: "Kura Artisanal Omakase",
        description: "An intimate 12-seat Japanese sushi bar offering authentic Edomae omakase, wild seafood flown directly from Toyosu Market Tokyo, and master-crafted ceramic service.",
        cuisine: "Japanese Omakase",
        priceLevel: "$$$$",
        address: {
          street: "88 Hinoki Way, West End",
          city: "Seattle",
          state: "WA",
          zipCode: "98101"
        },
        phone: "+1 (206) 555-9120",
        images: [
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80"
        ],
        openingHours: { open: "17:00", close: "22:30" },
        rating: 4.9,
        features: ["12-Seat Counter", "Exclusive Omakase", "Rare Sakes", "Strict Seating Times"],
        managerId: manager._id
      },
      {
        name: "Trattoria Bella Vista",
        description: "Sun-drenched Tuscan culinary sanctuary serving handcrafted bronze-die pastas, 48-hour fermented sourdough Neapolitan pizzas, and breathtaking terrace views.",
        cuisine: "Italian Tuscan",
        priceLevel: "$$",
        address: {
          street: "105 Cypress Hill Road",
          city: "Chicago",
          state: "IL",
          zipCode: "60611"
        },
        phone: "+1 (312) 555-3419",
        images: [
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80"
        ],
        openingHours: { open: "11:30", close: "23:00" },
        rating: 4.7,
        features: ["Wood-fired Oven", "Terrace Seating", "Extensive Wine Cellar", "Family Friendly"],
        managerId: manager._id
      },
      {
        name: "The Velvet Cellar Steakhouse",
        description: "An opulent subterranean sanctuary featuring USDA Prime 45-day dry-aged steaks, smoked tableside bourbon cocktails, and secluded private leather booths.",
        cuisine: "Prime Steakhouse",
        priceLevel: "$$$",
        address: {
          street: "210 Saint Charles Arcade",
          city: "Boston",
          state: "MA",
          zipCode: "02116"
        },
        phone: "+1 (617) 555-4488",
        images: [
          "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1502301103665-0b95cc738daf?auto=format&fit=crop&w=800&q=80"
        ],
        openingHours: { open: "16:00", close: "23:30" },
        rating: 4.8,
        features: ["Dry Aged Locker", "Live Jazz Evenings", "Private Booths", "Sommelier on Duty"],
        managerId: manager._id
      }
    ];

    const createdRestaurants = await Restaurant.create(restaurantsData);
    console.log(`[Seed] Created ${createdRestaurants.length} restaurants.`);

    console.log('[Seed] Creating table configurations for each restaurant...');
    const allTables = [];

    for (const rest of createdRestaurants) {
      const tableConfigs = [
        { tableNumber: 'T1', capacity: 2, area: 'Window View' },
        { tableNumber: 'T2', capacity: 2, area: 'Window View' },
        { tableNumber: 'T3', capacity: 4, area: 'Main Dining Room' },
        { tableNumber: 'T4', capacity: 4, area: 'Main Dining Room' },
        { tableNumber: 'T5', capacity: 6, area: 'Main Dining Room' },
        { tableNumber: 'T6', capacity: 8, area: 'Terrace & Patio' },
        { tableNumber: 'T7', capacity: 10, area: 'Private Dining / Lounge' }
      ];

      for (const cfg of tableConfigs) {
        allTables.push({
          restaurantId: rest._id,
          tableNumber: cfg.tableNumber,
          capacity: cfg.capacity,
          area: cfg.area,
          isActive: true
        });
      }
    }

    const createdTables = await Table.create(allTables);
    console.log(`[Seed] Created ${createdTables.length} tables across restaurants.`);

    console.log('[Seed] Creating realistic demonstration reservations...');
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Next week date
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 3);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    const r1 = createdRestaurants[0]; // L'Etoile Royale
    const r1Tables = createdTables.filter(t => t.restaurantId.toString() === r1._id.toString());

    const r2 = createdRestaurants[1]; // Aura Modern Indian
    const r2Tables = createdTables.filter(t => t.restaurantId.toString() === r2._id.toString());

    const demoReservations = [
      {
        userId: customer._id,
        restaurantId: r1._id,
        tableId: r1Tables[0]._id, // T1 (capacity 2)
        date: todayStr,
        startTime: '19:00',
        endTime: '20:30',
        partySize: 2,
        specialRequests: 'Anniversary dinner with champagne on arrival',
        status: 'confirmed'
      },
      {
        userId: customer._id,
        restaurantId: r1._id,
        tableId: r1Tables[2]._id, // T3 (capacity 4)
        date: todayStr,
        startTime: '20:00',
        endTime: '21:30',
        partySize: 4,
        specialRequests: 'Corner booth preferred, celebrating promotion',
        status: 'seated'
      },
      {
        userId: customer._id,
        restaurantId: r2._id,
        tableId: r2Tables[1]._id, // T2 (capacity 2)
        date: tomorrowStr,
        startTime: '13:00',
        endTime: '14:30',
        partySize: 2,
        specialRequests: 'Vegan and nut allergy considerations please',
        status: 'confirmed'
      },
      {
        userId: customer._id,
        restaurantId: r2._id,
        tableId: r2Tables[3]._id, // T4 (capacity 4)
        date: nextWeekStr,
        startTime: '18:30',
        endTime: '20:00',
        partySize: 4,
        specialRequests: 'Window seat if available',
        status: 'pending'
      }
    ];

    await Reservation.create(demoReservations);
    console.log('[Seed] Demonstration reservations created.');

    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('🔑 DEMO ACCOUNTS:');
    console.log('   Manager Account:');
    console.log('     Email:    manager@tablereserve.com');
    console.log('     Password: Manager@123');
    console.log('     Role:     manager');
    console.log('   Customer Account:');
    console.log('     Email:    customer@tablereserve.com');
    console.log('     Password: Customer@123');
    console.log('     Role:     customer');
    console.log('   Admin Account:');
    console.log('     Email:    admin@tablereserve.com');
    console.log('     Password: Admin@123');
    console.log('     Role:     admin');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
