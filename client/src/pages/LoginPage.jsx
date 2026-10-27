import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'manager' || loggedUser.role === 'admin') {
        navigate('/manager');
      } else {
        navigate('/my-reservations');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="luxury-card p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="fs-1 mb-2 d-inline-block">🍷</span>
                <h2 className="font-serif fs-3 mb-1">Welcome Back</h2>
                <p className="text-muted small">Sign in to your TableReserve dining account</p>
              </div>

              {redirectMessage && (
                <div className="alert alert-info py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-info-circle-fill"></i>
                  <span>{redirectMessage}</span>
                </div>
              )}

              {error && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-muted mb-0">Password</label>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
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
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              {/* Demo Quick-Fill Buttons */}
              <div className="mt-4 pt-3 border-top text-center">
                <span className="small text-muted d-block mb-2">College Lab Demo Quick-Fill:</span>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleQuickFill('customer@tablereserve.com', 'Customer@123')}
                  >
                    <i className="bi bi-person me-1"></i> Customer
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-gold-outline"
                    onClick={() => handleQuickFill('manager@tablereserve.com', 'Manager@123')}
                  >
                    <i className="bi bi-shield-lock me-1"></i> Manager
                  </button>
                </div>
              </div>

              <div className="text-center mt-4 pt-2 small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: 'var(--burgundy)' }}>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
