import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { RestaurantCard } from '../components/RestaurantCard';
import { SearchFilters } from '../components/SearchFilters';
import { Loading, ErrorMessage } from '../components/Feedback';

export const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || 'All');
  const [priceLevel, setPriceLevel] = useState(searchParams.get('priceLevel') || 'All');

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRestaurants = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.restaurants.getAll({
        search,
        cuisine,
        priceLevel
      });
      if (res.success) {
        setRestaurants(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [search, cuisine, priceLevel]);

  const handleReset = () => {
    setSearch('');
    setCuisine('All');
    setPriceLevel('All');
    setSearchParams({});
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="mb-4">
          <span className="text-uppercase tracking-wider small fw-semibold" style={{ color: 'var(--burgundy)' }}>
            Curated Portfolio
          </span>
          <h1 className="font-serif fs-2 mb-1">Discover Exceptional Dining</h1>
          <p className="text-muted small">
            Explore our Michelin-acclaimed and chef-driven dining rooms across premier destinations.
          </p>
        </div>

        <SearchFilters
          search={search}
          setSearch={setSearch}
          cuisine={cuisine}
          setCuisine={setCuisine}
          priceLevel={priceLevel}
          setPriceLevel={setPriceLevel}
          onReset={handleReset}
        />

        {loading && <Loading message="Finding tables matching your criteria..." />}
        {error && <ErrorMessage message={error} onRetry={fetchRestaurants} />}

        {!loading && !error && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">
                Showing <strong>{restaurants.length}</strong> dining {restaurants.length === 1 ? 'destination' : 'destinations'}
              </span>
            </div>

            {restaurants.length === 0 ? (
              <div className="text-center py-5 bg-white rounded-3 border my-3">
                <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
                <h4 className="font-serif mt-3 text-muted">No dining venues match your search</h4>
                <p className="text-muted small mb-3">
                  Try adjusting your search terms or clearing cuisine filters.
                </p>
                <button className="btn btn-gold-outline btn-sm" onClick={handleReset}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {restaurants.map((restaurant) => (
                  <div key={restaurant._id} className="col-lg-4 col-md-6">
                    <RestaurantCard restaurant={restaurant} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
