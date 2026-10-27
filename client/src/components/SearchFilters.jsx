import React from 'react';

export const SearchFilters = ({
  search,
  setSearch,
  cuisine,
  setCuisine,
  priceLevel,
  setPriceLevel,
  onReset
}) => {
  const cuisines = [
    'All',
    'French Contemporary',
    'Progressive Indian',
    'Japanese Omakase',
    'Italian Tuscan',
    'Prime Steakhouse'
  ];

  const priceLevels = ['All', '$', '$$', '$$$', '$$$$'];

  return (
    <div className="luxury-card p-3 p-md-4 mb-4">
      <div className="row g-3 align-items-center">
        <div className="col-lg-5 col-md-6">
          <label className="form-label small fw-semibold text-muted mb-1">Search Venues & Locations</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by restaurant name, city, ambiance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="col-lg-3 col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">Cuisine Type</label>
          <select
            className="form-select"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            {cuisines.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Cuisines' : c}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">Price Range</label>
          <select
            className="form-select"
            value={priceLevel}
            onChange={(e) => setPriceLevel(e.target.value)}
          >
            {priceLevels.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'Any Price' : p}
              </option>
            ))}
          </select>
        </div>

        <div className="col-lg-2 col-md-12 d-flex align-items-end">
          <button
            type="button"
            className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-1"
            onClick={onReset}
            style={{ height: '38px', marginTop: 'auto' }}
          >
            <i className="bi bi-x-circle"></i>
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
