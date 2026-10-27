import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto py-5 border-top" style={{ backgroundColor: '#1A1817', color: '#D4CECA' }}>
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="font-serif text-white mb-3">
              Table<span style={{ color: 'var(--gold)' }}>Reserve</span>
            </h4>
            <p className="text-secondary small pe-lg-4">
              A bespoke fine-dining discovery and guaranteed table allocation platform engineered with the MERN stack for modern culinary connoisseurs.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5">
              <a href="#instagram" className="text-secondary hover-gold"><i className="bi bi-instagram"></i></a>
              <a href="#facebook" className="text-secondary hover-gold"><i className="bi bi-facebook"></i></a>
              <a href="#twitter" className="text-secondary hover-gold"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white text-uppercase tracking-wider small fw-bold mb-3">Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
              <li><Link to="/restaurants" className="text-secondary text-decoration-none">Restaurants</Link></li>
              <li><Link to="/about" className="text-secondary text-decoration-none">About System</Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none">Contact & Support</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white text-uppercase tracking-wider small fw-bold mb-3">Curated Cuisines</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li><Link to="/restaurants?cuisine=French Contemporary" className="text-secondary text-decoration-none">French Contemporary</Link></li>
              <li><Link to="/restaurants?cuisine=Progressive Indian" className="text-secondary text-decoration-none">Progressive Indian</Link></li>
              <li><Link to="/restaurants?cuisine=Japanese Omakase" className="text-secondary text-decoration-none">Japanese Omakase</Link></li>
              <li><Link to="/restaurants?cuisine=Italian Tuscan" className="text-secondary text-decoration-none">Italian Tuscan</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-white text-uppercase tracking-wider small fw-bold mb-3">Lab Experiment Info</h6>
            <div className="bg-dark p-3 rounded border border-secondary small text-secondary">
              <div className="fw-semibold text-white mb-1">Experiment 10 Project</div>
              <div>Course: Full Stack Web Development</div>
              <div className="mt-2 text-warning"><i className="bi bi-check-circle-fill me-1"></i> MERN Stack Ready</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-top border-secondary text-secondary small d-flex flex-wrap justify-content-between align-items-center">
          <div>&copy; {new Date().getFullYear()} TableReserve Platform. All rights reserved.</div>
          <div className="d-flex gap-3">
            <span>Server: localhost:5000</span>
            <span>•</span>
            <span>Client: localhost:5173</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
