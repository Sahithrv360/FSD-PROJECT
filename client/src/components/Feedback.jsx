import React from 'react';

export const Loading = ({ message = 'Loading exquisite dining experiences...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-4">
      <div
        className="spinner-border mb-3"
        style={{ width: '3rem', height: '3rem', color: 'var(--burgundy)' }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-medium font-serif fs-5 mb-0">{message}</p>
    </div>
  );
};

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 my-3 shadow-sm rounded-3" role="alert">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-exclamation-triangle-fill fs-5"></i>
        <div>
          <strong>Error:</strong> {message || 'An unexpected error occurred. Please try again.'}
        </div>
      </div>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i> Retry
        </button>
      )}
    </div>
  );
};
