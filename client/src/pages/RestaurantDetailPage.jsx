import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ReservationForm } from '../components/ReservationForm';
import { Loading, ErrorMessage } from '../components/Feedback';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80';

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.restaurants.getById(id);
        if (res.success) {
          setRestaurant(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5">
        <Loading message="Preparing fine-dining profile..." />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container py-5">
        <ErrorMessage message={error || 'Restaurant not found'} />
        <div className="text-center mt-3">
          <Link to="/restaurants" className="btn btn-gold-outline btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  const images = (restaurant.images && restaurant.images.length > 0)
    ? restaurant.images
    : [DEFAULT_IMAGE];

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/restaurants" className="text-decoration-none text-muted">Restaurants</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{restaurant.name}</li>
          </ol>
        </nav>

        {/* Gallery / Showcase */}
        <div className="row g-3 mb-4">
          <div className="col-lg-8">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ height: '420px' }}>
              <img
                src={images[activeImage]}
                alt={restaurant.name}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="d-flex gap-2 mt-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`border rounded-2 p-0 overflow-hidden ${activeImage === idx ? 'border-danger border-2' : ''}`}
                    style={{ width: '80px', height: '55px' }}
                  >
                    <img src={img} alt="thumbnail" className="w-100 h-100 object-fit-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 border h-100 shadow-sm d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge badge-gold">{restaurant.priceLevel}</span>
                  <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                    <i className="bi bi-star-fill"></i>
                    <span className="text-dark small">{restaurant.rating?.toFixed(1) || '4.9'}</span>
                  </div>
                </div>

                <h1 className="font-serif fs-2 mb-2" style={{ color: 'var(--text-main)' }}>
                  {restaurant.name}
                </h1>

                <div className="text-uppercase tracking-wider small fw-semibold text-muted mb-3">
                  {restaurant.cuisine}
                </div>

                <div className="d-flex flex-column gap-2 small text-muted border-top border-bottom py-3 my-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-geo-alt-fill text-danger fs-6"></i>
                    <span>{restaurant.address?.street}, {restaurant.address?.city}, {restaurant.address?.state}</span>
                  </div>
                  {restaurant.phone && (
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-telephone-fill text-success fs-6"></i>
                      <span>{restaurant.phone}</span>
                    </div>
                  )}
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-clock-fill text-primary fs-6"></i>
                    <span>Operating Hours: {restaurant.openingHours?.open} – {restaurant.openingHours?.close}</span>
                  </div>
                </div>

                {restaurant.features && (
                  <div>
                    <h6 className="small fw-bold text-dark text-uppercase tracking-wider mb-2">Ambiance & Amenities</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {restaurant.features.map((feat, idx) => (
                        <span key={idx} className="badge bg-light text-secondary border small">
                          <i className="bi bi-check2 text-success me-1"></i>
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-top small text-muted">
                <i className="bi bi-shield-check text-success me-1"></i>
                Guaranteed Table Allocation by TableReserve Concierge
              </div>
            </div>
          </div>
        </div>

        {/* Description & Reservation Booking Form Row */}
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="bg-white p-4 rounded-4 border shadow-sm mb-4">
              <h3 className="font-serif fs-4 mb-3">About the Experience</h3>
              <p className="text-muted leading-relaxed" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                {restaurant.description}
              </p>

              <h4 className="font-serif fs-5 mt-4 mb-3">Dining Areas & Table Capacities</h4>
              <div className="row g-2">
                {restaurant.tables && restaurant.tables.map((t) => (
                  <div key={t._id} className="col-sm-6">
                    <div className="p-3 bg-light border rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold small">Table #{t.tableNumber}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{t.area}</div>
                      </div>
                      <span className="badge bg-white text-dark border">
                        Up to {t.capacity} guests
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="sticky-top" style={{ top: '90px' }}>
              <ReservationForm restaurant={restaurant} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
