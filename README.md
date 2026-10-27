# TableReserve — Premium Restaurant Reservation and Management System
**Full Stack Web Development Laboratory — Experiment 10 Project**

[![Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v24.x-blue.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/MongoDB-Community_Server-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

---

## 1. Project Overview & Aim
**TableReserve** is a full-stack, enterprise-grade restaurant discovery and table reservation web application engineered using the **MERN** stack (MongoDB, Express.js, React with Vite, Node.js) and Bootstrap 5.

The application allows dining customers to discover fine-dining venues, inspect table layouts, view real-time slot availability, and book guaranteed reservations. Restaurant managers have access to a dedicated floor management command center with reservation filtering, real-time status transitions, floorplan table configuration, and MongoDB aggregation analytics.

---

## 2. Key Architecture & Features

### Customer Experience
* **Curated Dining Discovery**: Rich catalog of fine-dining venues with cuisine filtering (French, Progressive Indian, Japanese Omakase, Tuscan, Steakhouse) and price level tiers.
* **Real-Time Slot Availability**: Intelligent slot generator calculating 90-minute dining windows within restaurant operating hours.
* **Conflict Prevention**: Server-side overlapping interval algebra preventing double-booking; returns HTTP 409 Conflict with informative guidance.
* **Table Section Preference**: Diners can choose specific areas (Window View, Main Hall, Terrace, Private Lounge) or allow auto-allocation.
* **Reservation Lifecycle**: Diners track upcoming bookings and can cancel reservations to immediately release table inventory.

### Manager Command Center
* **Live Floor Metrics**: Today's booking count, pending requests, and active tables.
* **Reservation Management**: Filter by date, status, and venue; update statuses (`confirmed`, `seated`, `completed`, `cancelled`, `rejected`).
* **Table Floorplan Management**: Add tables with capacity, area classification, and toggle active status.
* **MongoDB Aggregation Reports**: Real database pipelines (`$group`, `$lookup`, `$sort`) for status breakdown and daily trend analytics.

---

## 3. Technology Stack

| Tier | Technologies / Packages | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Bootstrap 5, Bootstrap Icons | Responsive UI, state management, SPA routing, fine-dining aesthetic |
| **Backend** | Node.js, Express.js (ES Modules) | RESTful API controllers, routing, middleware |
| **Database** | MongoDB Community Server, Mongoose ODM | Document collections, unique indexes, aggregation pipelines |
| **Security** | JWT (`jsonwebtoken`), `bcryptjs`, CORS, `dotenv` | Token authentication, password hashing, role authorization |
| **API Testing** | Native Fetch Suite, Postman v2.1 Collection | Automated test suite and Postman integration |

---

## 4. Project Directory Structure

```text
TableReserve/
├── client/                     # Frontend Tier (React + Vite)
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── BookingTable.jsx    # Reservation management table
│   │   │   ├── Feedback.jsx        # Loading spinner & error banners
│   │   │   ├── Footer.jsx          # Fine-dining footer
│   │   │   ├── Navbar.jsx          # Responsive brand navigation
│   │   │   ├── ReservationForm.jsx # Live slot selector & conflict handling
│   │   │   ├── RestaurantCard.jsx  # Venue card with rating & pricing
│   │   │   └── SearchFilters.jsx   # Search & filter inputs
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # User authentication state provider
│   │   ├── pages/              # Application views
│   │   │   ├── AboutPage.jsx       # Experiment 10 background & stack
│   │   │   ├── ContactPage.jsx     # Concierge contact & inquiry form
│   │   │   ├── HomePage.jsx        # Hero, featured venues, cuisine grid
│   │   │   ├── LoginPage.jsx       # Sign in with demo quick-fill buttons
│   │   │   ├── ManagerDashboardPage.jsx # Floorplan, reservations, analytics
│   │   │   ├── MyReservationsPage.jsx  # Diner bookings & cancel action
│   │   │   ├── RegisterPage.jsx    # Diner & manager registration
│   │   │   ├── RestaurantDetailPage.jsx # Gallery, details, booking panel
│   │   │   └── RestaurantsPage.jsx # Filterable venue directory
│   │   ├── services/
│   │   │   └── api.js              # Centralized Fetch API client
│   │   ├── App.jsx             # React Router route configuration
│   │   ├── index.css           # Luxury design system & tokens
│   │   └── main.jsx            # React root mount
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend Tier (Node.js + Express + Mongoose)
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/            # REST API controllers
│   │   ├── authController.js       # Register, login, me
│   │   ├── managerController.js    # Dashboard, reports, status updates
│   │   ├── reservationController.js# Availability check, booking, cancel
│   │   ├── restaurantController.js # CRUD for restaurants
│   │   └── tableController.js      # Table floorplan management
│   ├── middleware/
│   │   ├── auth.js             # JWT verification & role authorization
│   │   └── errorHandler.js     # Centralized Mongoose error handler
│   ├── models/                 # Mongoose schemas
│   │   ├── Reservation.js      # Booking records with date/time slots
│   │   ├── Restaurant.js       # Venue profiles & operating hours
│   │   ├── Table.js            # Floor tables with capacity & area
│   │   └── User.js             # User accounts with bcrypt hashing
│   ├── routes/                 # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── managerRoutes.js
│   │   ├── reservationRoutes.js
│   │   ├── restaurantRoutes.js
│   │   └── tableRoutes.js
│   ├── scripts/
│   │   ├── seed.js             # Idempotent demo database seeder
│   │   └── testSuite.js        # Automated API test suite (17 tests)
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── server.js               # Express application entrypoint
├── postman/
│   └── TableReserve.postman_collection.json # Exported Postman collection
├── LAB_REPORT.md               # Complete lab report documentation
├── README.md                   # Project overview & running instructions
└── .gitignore                  # Git ignore rules
```

---

## 5. Demonstration Accounts

The database seed script sets up default demo accounts:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Manager** | `manager@tablereserve.com` | `Manager@123` | Full floorplan management, status updates, analytics |
| **Customer** | `customer@tablereserve.com` | `Customer@123` | Venue booking, conflict simulation, booking history |
| **Admin** | `admin@tablereserve.com` | `Admin@123` | System-wide administrative oversight |

> *Quick-Fill Convenience*: The `/login` page includes one-click buttons to automatically populate customer or manager credentials for college lab demonstrations.

---

## 6. Installation & Execution Guide

### Prerequisites
* **Node.js** (v18.x or v20.x+)
* **MongoDB Community Server** installed and running on port `27017`

### Step 1: Clone or Navigate to Directory
```powershell
cd c:\Users\sahit\OneDrive\Desktop\case_studies\tableserve
```

### Step 2: Configure Environment Variables
Inside `server/`, verify `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tablereserve
JWT_SECRET=supersecret_tablereserve_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RESTAURANT_TIMEZONE=Asia/Kolkata
```

### Step 3: Seed the Database
Populate 5 fine-dining restaurants, 35 tables, demo users, and bookings:
```powershell
cd server
npm run seed
```

### Step 4: Run the Backend Server
```powershell
# In terminal 1 (server directory)
npm start
# Server listens on http://localhost:5000
```

### Step 5: Run the Frontend Client
```powershell
# In terminal 2 (client directory)
cd ..\client
npm run dev
# Frontend accessible at http://localhost:5173
```

---

## 7. REST API Endpoints

### Authentication
* `POST /api/auth/register` — Register customer or manager account
* `POST /api/auth/login` — Sign in and receive JWT token
* `GET /api/auth/me` — Retrieve active user profile *(Bearer Token)*

### Restaurants & Tables
* `GET /api/restaurants` — Filter venues by search keyword, cuisine, price
* `GET /api/restaurants/:id` — Venue details, photos, and tables
* `GET /api/restaurants/:id/tables` — List floor tables
* `POST /api/restaurants/:id/tables` — Add table *(Manager/Admin)*
* `PUT /api/tables/:id` — Update capacity, section, or active status

### Availability & Reservations
* `GET /api/restaurants/:id/availability?date=YYYY-MM-DD&time=HH:mm&partySize=N` — Live slot calculation
* `POST /api/reservations` — Book a table *(Returns 409 Conflict if booked)*
* `GET /api/reservations/my` — Customer reservation history
* `GET /api/reservations/:id` — Reservation details
* `PATCH /api/reservations/:id/cancel` — Cancel reservation & release table

### Manager Operations & Aggregations
* `GET /api/manager/dashboard` — Today's bookings, pending, table count
* `GET /api/manager/reports` — Real MongoDB `$group` aggregation pipeline
* `GET /api/manager/reservations` — View all bookings with date/status filters
* `PATCH /api/manager/reservations/:id/status` — Update status to `seated`, `completed`, `rejected`

---

## 8. Reservation Logic & Concurrency Note

1. **Party Size Check**: `partySize <= table.capacity`.
2. **Operating Hours**: Booking interval must fall within restaurant's open and close times.
3. **Overlapping Interval Formula**:
   ```javascript
   startTime < existingEndTime && endTime > existingStartTime
   ```
4. **Active Blocking Statuses**: `['pending', 'confirmed', 'seated']`. Cancelled and rejected reservations release the table immediately.
5. **Conflict Response**: When a collision occurs, server returns **HTTP 409 Conflict** with an informative JSON message.
6. **MongoDB Concurrency**: Standalone Community MongoDB executes atomic pre-insert validation. In production replica sets, multi-document transactions (`session.startTransaction()`) provide ACID serializability.

---

## 9. Automated Testing

To run the automated 17-point test suite:
```powershell
cd server
node scripts/testSuite.js
```
All 17 checks test authentication, 409 conflict handling, cancellations, role authorization, and aggregations.

---

## 10. Postman Collection
Import `postman/TableReserve.postman_collection.json` into Postman. It includes pre-configured variables (`baseUrl`, `authToken`, `managerToken`, `restaurantId`, `tableId`) and automatic token assignment tests.

# FSD---PROJECT-
