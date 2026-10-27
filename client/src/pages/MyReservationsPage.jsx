import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BookingTable } from '../components/BookingTable';
import { Loading, ErrorMessage } from '../components/Feedback';

export const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchMyBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.reservations.getMy();
      if (res.success) {
        setReservations(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancelBooking = async (reservationId) => {
    if (!window.confirm('Are you sure you wish to cancel this dining reservation?')) {
      return;
    }

    setActionLoadingId(reservationId);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.reservations.cancel(reservationId);
      if (res.success) {
        setSuccessMsg('Reservation cancelled successfully. Table has been released.');
        // Refresh bookings
        await fetchMyBookings();
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel reservation');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <span className="text-uppercase tracking-wider small fw-semibold" style={{ color: 'var(--burgundy)' }}>
              Guest Portal
            </span>
            <h1 className="font-serif fs-2 mb-1">My Table Reservations</h1>
            <p className="text-muted small mb-0">
              Manage your confirmed upcoming dining appointments and review past experiences.
            </p>
          </div>
          <Link to="/restaurants" className="btn btn-burgundy mt-3 mt-md-0 d-flex align-items-center gap-2">
            <i className="bi bi-plus-circle"></i>
            <span>Book Another Table</span>
          </Link>
        </div>

        {successMsg && (
          <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3">
            <i className="bi bi-check-circle-fill"></i>
            <span>{successMsg}</span>
          </div>
        )}

        {error && <ErrorMessage message={error} onRetry={fetchMyBookings} />}

        {loading ? (
          <Loading message="Fetching your dining reservations..." />
        ) : (
          <BookingTable
            reservations={reservations}
            isManagerView={false}
            onCancel={handleCancelBooking}
            actionLoadingId={actionLoadingId}
          />
        )}
      </div>
    </div>
  );
};
