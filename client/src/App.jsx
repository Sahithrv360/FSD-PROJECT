import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyReservationsPage } from './pages/MyReservationsPage';
import { ManagerDashboardPage } from './pages/ManagerDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Protected Route Component for Logged-In Diners
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ message: 'Please log in to view your reservations.' }} />;
  }

  return children;
};

// Manager Route Component
const ManagerRoute = ({ children }) => {
  const { isAuthenticated, isManager, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ message: 'Manager authentication required.' }} />;
  }

  if (!isManager) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning p-4 shadow-sm">
          <i className="bi bi-shield-exclamation fs-1 text-warning d-block mb-2"></i>
          <h4>Manager Access Required</h4>
          <p className="text-muted small">
            Your current account does not have restaurant manager privileges. Please sign in with a manager profile.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

// 404 Not Found Page
const NotFound = () => (
  <div className="container py-5 text-center my-5">
    <span className="fs-1 d-block mb-2">🍽️</span>
    <h1 className="font-serif display-4">404</h1>
    <h4 className="font-serif text-muted">Dining Page Not Found</h4>
    <p className="text-muted small mb-4">
      The table or resource you are looking for has been moved or does not exist.
    </p>
    <a href="/" className="btn btn-burgundy btn-sm">
      Return to Home
    </a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/my-reservations"
                element={
                  <ProtectedRoute>
                    <MyReservationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <ManagerRoute>
                    <ManagerDashboardPage />
                  </ManagerRoute>
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
