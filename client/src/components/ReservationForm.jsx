import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ReservationForm = ({ restaurant, initialDate, initialPartySize = 2 }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Tomorrow as default date if today is late
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(initialDate || getTomorrowStr());
  const [partySize, setPartySize] = useState(initialPartySize);
  const [selectedTime, setSelectedTime] = useState('19:00');
  const [selectedTableId, setSelectedTableId] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const [availabilityData, setAvailabilityData] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch availability when date, partySize, or restaurant changes
  useEffect(() => {
    let isMounted = true;

    const fetchAvailability = async () => {
      if (!restaurant?._id || !date) return;
      setLoadingAvailability(true);
      setConflictError('');
      setGeneralError('');

      try {
        const res = await api.restaurants.getAvailability(
          restaurant._id,
          date,
          selectedTime,
          partySize
        );
        if (isMounted && res.success) {
          setAvailabilityData(res.data);
          // If previously selected table is no longer available, reset table selection
          if (selectedTableId) {
            const isStillFree = res.data.availableTables?.some(
              (t) => t._id === selectedTableId
            );
            if (!isStillFree) {
              setSelectedTableId('');
            }
          }
        }
      } catch (err) {
        console.error('[Availability Check Error]:', err);
      } finally {
        if (isMounted) setLoadingAvailability(false);
      }
    };

    fetchAvailability();

    return () => {
      isMounted = false;
    };
  }, [restaurant?._id, date, partySize, selectedTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', {
        state: { message: 'Please sign in to confirm your dining reservation.' }
      });
      return;
    }

    setConflictError('');
    setGeneralError('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      const payload = {
        restaurantId: restaurant._id,
        date,
        startTime: selectedTime,
        partySize: Number(partySize),
        specialRequests
      };

      if (selectedTableId) {
        payload.tableId = selectedTableId;
      }

      const res = await api.reservations.create(payload);

      if (res.success) {
        setSuccessMessage(
          `Table reservation confirmed for ${res.data.partySize} guests at ${restaurant.name} on ${res.data.date} at ${res.data.startTime}!`
        );
        setTimeout(() => {
          navigate('/my-reservations');
        }, 2000);
      }
    } catch (err) {
      console.error('[Reservation Error]:', err);
      if (err.status === 409 || err.isConflict) {
        setConflictError(
          err.message || 'Conflict: This dining slot or table has just been reserved. Please pick an alternative time or table.'
        );
      } else {
        setGeneralError(err.message || 'Failed to complete reservation. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="luxury-card p-4">
      <div className="border-bottom pb-3 mb-4">
        <h4 className="font-serif mb-1" style={{ color: 'var(--text-main)' }}>
          Reserve Your Table
        </h4>
        <p className="text-muted small mb-0">
          Instant guaranteed booking • Default duration: 90 mins
        </p>
      </div>

      {conflictError && (
        <div className="conflict-alert mb-4 d-flex align-items-start gap-2 shadow-sm" role="alert">
          <i className="bi bi-calendar-x-fill fs-5 mt-1"></i>
          <div>
            <div className="fw-bold">Booking Conflict Detected (HTTP 409)</div>
            <div className="small mt-1">{conflictError}</div>
          </div>
        </div>
      )}

      {generalError && (
        <div className="alert alert-danger mb-4 small py-2 d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill fs-5 text-success"></i>
          <div>
            <div className="fw-bold">Reservation Confirmed!</div>
            <div className="small">{successMessage}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-sm-6">
            <label className="form-label small fw-semibold text-muted">
              <i className="bi bi-calendar-event me-1"></i> Date
            </label>
            <input
              type="date"
              className="form-control"
              min={todayStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="col-sm-6">
            <label className="form-label small fw-semibold text-muted">
              <i className="bi bi-people me-1"></i> Party Size
            </label>
            <select
              className="form-select"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label small fw-semibold text-muted mb-0">
              <i className="bi bi-clock me-1"></i> Dining Time Slot
            </label>
            {loadingAvailability && (
              <span className="badge bg-light text-secondary border small">
                Checking availability...
              </span>
            )}
          </div>

          <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {availabilityData?.slots?.map((slot) => (
              <button
                type="button"
                key={slot.time}
                disabled={!slot.isAvailable}
                className={`slot-pill ${selectedTime === slot.time ? 'active' : ''}`}
                onClick={() => setSelectedTime(slot.time)}
                title={slot.isAvailable ? `${slot.availableTablesCount} table(s) free` : 'Unavailable'}
              >
                {slot.time}
              </button>
            ))}
          </div>
          <div className="form-text mt-1 text-muted small">
            Operating hours: {restaurant?.openingHours?.open}–{restaurant?.openingHours?.close}
          </div>
        </div>

        {/* Optional Table Selection */}
        <div className="mb-3">
          <label className="form-label small fw-semibold text-muted">
            <i className="bi bi-grid-3x3 me-1"></i> Table Allocation
          </label>
          <select
            className="form-select"
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
          >
            <option value="">
              Auto-Allocate Best Table ({availabilityData?.availableTablesCount || 0} available)
            </option>
            {availabilityData?.availableTables?.map((table) => (
              <option key={table._id} value={table._id}>
                Table #{table.tableNumber} — {table.area} (Seats up to {table.capacity})
              </option>
            ))}
          </select>
          <div className="form-text small text-muted">
            Select a specific section or let our concierge automatically assign the premier table.
          </div>
        </div>

        {/* Special Requests */}
        <div className="mb-4">
          <label className="form-label small fw-semibold text-muted">
            <i className="bi bi-chat-left-text me-1"></i> Special Requests (Optional)
          </label>
          <textarea
            className="form-control"
            rows="2"
            placeholder="Dietary allergies, window seat preference, celebratory champagne..."
            value={specialRequests}
            maxLength={300}
            onChange={(e) => setSpecialRequests(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting || (availabilityData && availabilityData.availableTablesCount === 0)}
          className="btn btn-burgundy w-100 py-3 d-flex align-items-center justify-content-center gap-2 shadow"
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Securing Reservation...</span>
            </>
          ) : (
            <>
              <i className="bi bi-check2-circle fs-5"></i>
              <span className="fw-semibold">
                Confirm Reservation at {selectedTime}
              </span>
            </>
          )}
        </button>

        {!isAuthenticated && (
          <div className="text-center mt-3 small text-muted">
            You will be prompted to sign in or create an account to finalize.
          </div>
        )}
      </form>
    </div>
  );
};
