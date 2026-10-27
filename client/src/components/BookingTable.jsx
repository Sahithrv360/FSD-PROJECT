import React from 'react';

export const BookingTable = ({
  reservations,
  isManagerView = false,
  onStatusChange,
  onCancel,
  actionLoadingId
}) => {
  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded-3 border">
        <i className="bi bi-calendar-x text-muted" style={{ fontSize: '2.5rem' }}></i>
        <h5 className="font-serif mt-3 text-muted">No reservations found</h5>
        <p className="text-muted small mb-0">
          {isManagerView
            ? 'No booking records match your current filters.'
            : 'You have no reservations scheduled yet.'}
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge status-confirmed px-2 py-1">Confirmed</span>;
      case 'seated':
        return <span className="badge status-seated px-2 py-1">Seated</span>;
      case 'completed':
        return <span className="badge status-completed px-2 py-1">Completed</span>;
      case 'pending':
        return <span className="badge status-pending px-2 py-1">Pending</span>;
      case 'cancelled':
        return <span className="badge status-cancelled px-2 py-1">Cancelled</span>;
      case 'rejected':
        return <span className="badge status-rejected px-2 py-1">Rejected</span>;
      default:
        return <span className="badge bg-secondary px-2 py-1">{status}</span>;
    }
  };

  return (
    <div className="table-responsive bg-white rounded-3 border shadow-sm">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light text-muted small text-uppercase">
          <tr>
            <th scope="col" className="ps-4">Date & Time</th>
            {isManagerView ? (
              <th scope="col">Customer</th>
            ) : (
              <th scope="col">Restaurant</th>
            )}
            <th scope="col">Table & Area</th>
            <th scope="col" className="text-center">Party</th>
            <th scope="col">Status</th>
            <th scope="col" className="text-end pe-4">Actions</th>
          </tr>
        </thead>
        <tbody className="small">
          {reservations.map((resv) => {
            const isLoading = actionLoadingId === resv._id;

            return (
              <tr key={resv._id}>
                <td className="ps-4">
                  <div className="fw-semibold text-dark">{resv.date}</div>
                  <div className="text-muted small">
                    <i className="bi bi-clock me-1"></i>
                    {resv.startTime} – {resv.endTime}
                  </div>
                </td>

                {isManagerView ? (
                  <td>
                    <div className="fw-semibold">{resv.userId?.name || 'Customer'}</div>
                    <div className="text-muted small">{resv.userId?.email}</div>
                    {resv.specialRequests && (
                      <div className="badge bg-light text-dark border mt-1" title={resv.specialRequests}>
                        <i className="bi bi-info-circle me-1"></i> Special Request
                      </div>
                    )}
                  </td>
                ) : (
                  <td>
                    <div className="fw-semibold">{resv.restaurantId?.name || 'Fine Dining'}</div>
                    <div className="text-muted small">
                      {resv.restaurantId?.address?.city || ''}
                    </div>
                  </td>
                )}

                <td>
                  <div className="fw-semibold">
                    Table #{resv.tableId?.tableNumber || 'Assigned'}
                  </div>
                  <div className="text-muted small">
                    {resv.tableId?.area || 'Main Hall'}
                  </div>
                </td>

                <td className="text-center">
                  <span className="badge bg-light text-dark border px-2 py-1">
                    <i className="bi bi-person-fill me-1"></i>
                    {resv.partySize}
                  </span>
                </td>

                <td>{getStatusBadge(resv.status)}</td>

                <td className="text-end pe-4">
                  {isManagerView ? (
                    <div className="dropdown d-inline-block">
                      <button
                        className="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Updating...' : 'Status'}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow-sm small">
                        <li>
                          <button
                            className="dropdown-item text-success"
                            onClick={() => onStatusChange(resv._id, 'confirmed')}
                          >
                            <i className="bi bi-check-circle me-2"></i> Confirm
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-primary"
                            onClick={() => onStatusChange(resv._id, 'seated')}
                          >
                            <i className="bi bi-person-check me-2"></i> Mark Seated
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-secondary"
                            onClick={() => onStatusChange(resv._id, 'completed')}
                          >
                            <i className="bi bi-award me-2"></i> Mark Completed
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => onStatusChange(resv._id, 'rejected')}
                          >
                            <i className="bi bi-x-circle me-2"></i> Reject
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => onStatusChange(resv._id, 'cancelled')}
                          >
                            <i className="bi bi-slash-circle me-2"></i> Cancel
                          </button>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div>
                      {['confirmed', 'pending'].includes(resv.status) ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={isLoading}
                          onClick={() => onCancel(resv._id)}
                        >
                          {isLoading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            'Cancel'
                          )}
                        </button>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
