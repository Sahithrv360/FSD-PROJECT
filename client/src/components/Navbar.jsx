import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isManager, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg luxury-navbar py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span
            className="d-flex align-items-center justify-content-center text-white rounded-circle shadow-sm"
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: 'var(--burgundy)',
              fontSize: '1.15rem'
            }}
          >
            🍽️
          </span>
          <span className="font-serif fs-4 fw-bold" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Table<span style={{ color: 'var(--burgundy)' }}>Reserve</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/restaurants">
                Restaurants
              </NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-reservations">
                  My Reservations
                </NavLink>
              </li>
            )}
            {isManager && (
              <li className="nav-item">
                <NavLink className="nav-link d-flex align-items-center gap-1" to="/manager">
                  <span>Manager Portal</span>
                  <span className="badge badge-gold">Staff</span>
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <div className="text-end d-none d-md-block">
                  <div className="fw-semibold text-capitalize" style={{ fontSize: '0.9rem' }}>
                    {user?.name}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill px-3"
                  title="Logout"
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-gold-outline px-3">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-burgundy px-3">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
