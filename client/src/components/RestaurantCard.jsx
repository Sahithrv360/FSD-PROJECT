import React from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

export const RestaurantCard = ({ restaurant }) => {
  const imageUrl = (restaurant.images && restaurant.images.length > 0)
    ? restaurant.images[0]
    : DEFAULT_IMAGE;

  return (
    <div className="card luxury-card h-100 overflow-hidden d-flex flex-column">
      <div className="position-relative" style={{ height: '220px', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={restaurant.name}
          className="w-100 h-100 object-fit-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        <div
          className="position-absolute top-0 start-0 m-3 px-2 py-1 rounded shadow-sm bg-white fw-bold d-flex align-items-center gap-1"
          style={{ fontSize: '0.8rem', color: '#B45309' }}
        >
          <i className="bi bi-star-fill text-warning"></i>
          <span>{restaurant.rating?.toFixed(1) || '4.8'}</span>
        </div>
        <div className="position-absolute bottom-0 end-0 m-3">
          <span className="badge badge-gold shadow-sm">{restaurant.priceLevel}</span>
        </div>
      </div>

      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-uppercase tracking-wider text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
            {restaurant.cuisine}
          </span>
          <span className="text-muted small">
            <i className="bi bi-clock me-1"></i>
            {restaurant.openingHours?.open}–{restaurant.openingHours?.close}
          </span>
        </div>

        <h5 className="card-title font-serif fs-4 mb-2" style={{ color: 'var(--text-main)' }}>
          {restaurant.name}
        </h5>

        <p className="card-text text-muted small mb-3 flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {restaurant.description}
        </p>

        <div className="text-muted small mb-3 d-flex align-items-center gap-1">
          <i className="bi bi-geo-alt text-danger"></i>
          <span>{restaurant.address?.city || 'Downtown'}, {restaurant.address?.street}</span>
        </div>

        {restaurant.features && restaurant.features.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {restaurant.features.slice(0, 2).map((feat, idx) => (
              <span key={idx} className="badge bg-light text-secondary border fw-normal" style={{ fontSize: '0.72rem' }}>
                {feat}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 border-top mt-auto">
          <Link
            to={`/restaurants/${restaurant._id}`}
            className="btn btn-burgundy w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <span>Reserve Table</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};
