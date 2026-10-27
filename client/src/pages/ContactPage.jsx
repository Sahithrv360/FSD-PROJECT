import React, { useState } from 'react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiries',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-5">
          <span className="badge badge-gold mb-2">Concierge & Dining Support</span>
          <h1 className="font-serif display-5 fw-bold">Get In Touch</h1>
          <p className="text-muted">
            Have questions regarding table allocations, fine dining partnerships, or our system?
          </p>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="luxury-card p-4 h-100 bg-white">
              <h4 className="font-serif fs-4 mb-3">Concierge Desk</h4>
              <p className="text-muted small mb-4">
                Our hospitality and engineering teams are available to support diners and venue partners.
              </p>

              <div className="d-flex flex-column gap-3 small text-muted">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-light text-burgundy fs-5">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Headquarters</div>
                    <div>College Lab Center, Department of CSE / IT</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-light text-burgundy fs-5">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Email Support</div>
                    <div>concierge@tablereserve.com</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-light text-burgundy fs-5">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Direct Line</div>
                    <div>+1 (800) 555-RESERVE</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-light text-burgundy fs-5">
                    <i className="bi bi-clock"></i>
                  </div>
                  <div>
                    <div className="fw-bold text-dark">Operating Hours</div>
                    <div>Monday – Sunday: 10:00 AM – 11:30 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="luxury-card p-4 bg-white">
              <h4 className="font-serif fs-4 mb-3">Send a Message</h4>

              {submitted ? (
                <div className="alert alert-success py-4 text-center">
                  <i className="bi bi-check-circle-fill fs-2 text-success d-block mb-2"></i>
                  <h5>Message Received</h5>
                  <p className="small text-muted mb-0">
                    Thank you for reaching out. Our concierge desk will review your inquiry shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Eleanor Vance"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="eleanor@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Inquiry Nature</label>
                    <select
                      className="form-select"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="General Inquiries">General Dining Inquiries</option>
                      <option value="Special Dietary Arrangement">Special Event or Dietary Arrangement</option>
                      <option value="Restaurant Partnership">Restaurant Venue Partnership</option>
                      <option value="Technical Lab Support">Full Stack Lab Evaluation Support</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-muted">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="How may our concierge assist your reservation experience?"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-burgundy w-100 py-2">
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
