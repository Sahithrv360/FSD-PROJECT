import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { RestaurantCard } from '../components/RestaurantCard';
import { Loading, ErrorMessage } from '../components/Feedback';

export const HomePage = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [partySize, setPartySize] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await api.restaurants.getAll();
        if (res.success) {
          setFeaturedRestaurants(res.data.slice(0, 3));
        }
      } catch (err) {
        setError(err.message || 'Failed to load featured venues');
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/restaurants?search=${encodeURIComponent(searchQuery)}`);
  };

  const cuisineCategories = [
    { name: 'French Contemporary', icon: '🍷', desc: 'Haute gastronomy & vintage cellar pairings' },
    { name: 'Progressive Indian', icon: '✨', desc: 'Regal Awadhi tandoor & molecular flair' },
    { name: 'Japanese Omakase', icon: '🍣', desc: 'Edomae sushi mastercrafted at the counter' },
    { name: 'Italian Tuscan', icon: '🍝', desc: 'Handmade bronze-die pastas & woodfired crusts' },
    { name: 'Prime Steakhouse', icon: '🥩', desc: '45-day dry-aged cuts & oak-smoked spirits' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-4">
        <div className="container">
          <div className="hero-banner shadow-lg text-center text-md-start">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <span className="badge badge-gold mb-3 text-uppercase tracking-wider">
                  Exclusive Fine-Dining Table Access
                </span>
                <h1 className="display-4 font-serif fw-bold mb-3 text-white">
                  Artisanal Culinary Experiences, <br />
                  <span style={{ color: 'var(--gold)' }}>Guaranteed Tables.</span>
                </h1>
                <p className="lead text-light mb-4 opacity-75" style={{ maxWidth: '600px' }}>
                  Discover award-winning tasting menus, Michelin-pedigree dining rooms, and instant conflict-free table reservations.
                </p>

                {/* Quick Search Card */}
                <form
                  onSubmit={handleHeroSearch}
                  className="bg-white p-3 rounded-3 shadow-lg d-flex flex-wrap flex-md-nowrap gap-2 align-items-center"
                  style={{ maxWidth: '650px' }}
                >
                  <div className="flex-grow-1">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-0 text-muted">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 shadow-none ps-0"
                        placeholder="Search restaurant, cuisine, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select border-0 bg-light small fw-medium"
                      style={{ width: '130px' }}
                      value={partySize}
                      onChange={(e) => setPartySize(e.target.value)}
                    >
                      {[1, 2, 4, 6, 8, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} Guests
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-burgundy text-nowrap px-4 py-2">
                      Find Tables
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <span className="text-uppercase tracking-wider small fw-semibold" style={{ color: 'var(--burgundy)' }}>
                Handcrafted Curation
              </span>
              <h2 className="font-serif fs-2 mb-0 mt-1">Featured Dining Destinations</h2>
            </div>
            <Link to="/restaurants" className="btn btn-gold-outline mt-3 mt-md-0 d-flex align-items-center gap-2">
              <span>View All Venues</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          {loading && <Loading message="Loading curated restaurants..." />}
          {error && <ErrorMessage message={error} />}

          {!loading && !error && (
            <div className="row g-4">
              {featuredRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="col-lg-4 col-md-6">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cuisine Categories */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-uppercase tracking-wider small fw-semibold" style={{ color: 'var(--gold-hover)' }}>
              Explore By Heritage
            </span>
            <h2 className="font-serif fs-2 mt-1">Exceptional Culinary Traditions</h2>
            <p className="text-muted small">Select an ambiance to explore curated restaurant collections</p>
          </div>

          <div className="row g-3 justify-content-center">
            {cuisineCategories.map((c) => (
              <div key={c.name} className="col-lg-2 col-md-4 col-6">
                <Link
                  to={`/restaurants?cuisine=${encodeURIComponent(c.name)}`}
                  className="text-decoration-none"
                >
                  <div className="p-3 text-center border rounded-3 h-100 luxury-card bg-light d-flex flex-column align-items-center justify-content-center">
                    <span className="fs-1 mb-2">{c.icon}</span>
                    <h6 className="font-serif text-dark fw-bold mb-1 small">{c.name}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                      {c.desc}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & System Features */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 border h-100">
                <div className="d-inline-flex p-3 rounded-circle bg-light text-burgundy mb-3 fs-3" style={{ color: 'var(--burgundy)' }}>
                  <i className="bi bi-shield-check"></i>
                </div>
                <h5 className="font-serif fw-bold">Live Availability Guarantee</h5>
                <p className="text-muted small mb-0">
                  Real-time seat verification on MongoDB prevents overlapping bookings and double-allocations.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 border h-100">
                <div className="d-inline-flex p-3 rounded-circle bg-light text-burgundy mb-3 fs-3" style={{ color: 'var(--burgundy)' }}>
                  <i className="bi bi-clock-history"></i>
                </div>
                <h5 className="font-serif fw-bold">Instant Confirmation</h5>
                <p className="text-muted small mb-0">
                  Direct digital allocation with your assigned table and immediate status tracking in your private dashboard.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 bg-white rounded-3 border h-100">
                <div className="d-inline-flex p-3 rounded-circle bg-light text-burgundy mb-3 fs-3" style={{ color: 'var(--burgundy)' }}>
                  <i className="bi bi-sliders"></i>
                </div>
                <h5 className="font-serif fw-bold">Manager Concierge Portal</h5>
                <p className="text-muted small mb-0">
                  Comprehensive floor management, table status updates, and MongoDB aggregation analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
