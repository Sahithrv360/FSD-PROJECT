import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const newUser = await register(name, email, password, role);
      if (newUser.role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/my-reservations');
      }
    } catch (err) {
      setError(err.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="luxury-card p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="fs-1 mb-2 d-inline-block">🍽️</span>
                <h2 className="font-serif fs-3 mb-1">Create an Account</h2>
                <p className="text-muted small">Join TableReserve to book priority restaurant tables</p>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Eleanor Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Password (min 6 characters)</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">Account Purpose</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="accountRole"
                        id="roleCustomer"
                        value="customer"
                        checked={role === 'customer'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <label className="form-check-label small" htmlFor="roleCustomer">
                        Guest / Diner
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="accountRole"
                        id="roleManager"
                        value="manager"
                        checked={role === 'manager'}
                        onChange={(e) => setRole(e.target.value)}
                      />
                      <label className="form-check-label small" htmlFor="roleManager">
                        Restaurant Manager
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-burgundy w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Register Account</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-2 small text-muted">
                Already have an account?{' '}
                <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: 'var(--burgundy)' }}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
