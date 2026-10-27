import React from 'react';

export const AboutPage = () => {
  return (
    <div className="py-5">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="text-center mb-5">
          <span className="badge badge-burgundy mb-2">College Laboratory Experiment 10</span>
          <h1 className="font-serif display-5 fw-bold">TableReserve Architecture</h1>
          <p className="lead text-muted">
            Premium Restaurant Reservation and Table Management System built using the MERN Stack.
          </p>
        </div>

        <div className="luxury-card p-4 p-md-5 mb-4">
          <h3 className="font-serif fs-3 mb-3">Project Objective & Context</h3>
          <p className="text-muted leading-relaxed">
            TableReserve represents the capstone deliverable for <strong>Experiment 10: Full Stack Web Development Laboratory</strong>. It consolidates concepts acquired in Experiments 1 through 9—spanning responsive HTML5 layout paradigms, modern CSS Grid/Flexbox styling, React components, React Router navigation, server-side Express REST API development, and MongoDB aggregation pipelines.
          </p>

          <hr className="my-4" />

          <h4 className="font-serif fs-4 mb-3">Core Technology Stack</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border">
                <h6 className="fw-bold mb-1" style={{ color: 'var(--burgundy)' }}>Frontend Tier</h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li>React 19 & Vite build tooling</li>
                  <li>React Router 7 for declarative client navigation</li>
                  <li>Context API for authentication state</li>
                  <li>Bootstrap 5 + Custom CSS fine-dining design system</li>
                  <li>Responsive layout for mobile, tablet, and desktop</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border">
                <h6 className="fw-bold mb-1" style={{ color: 'var(--gold-hover)' }}>Backend & Database Tier</h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li>Node.js runtime with Express.js REST API</li>
                  <li>MongoDB Community Server with Mongoose ODM</li>
                  <li>JWT (JSON Web Tokens) with role authorization</li>
                  <li>Bcrypt password hashing</li>
                  <li>Server-side table conflict detection & HTTP 409 handling</li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <h4 className="font-serif fs-4 mb-3">Key Engineering Features</h4>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-start gap-3">
              <div className="p-2 rounded bg-light text-burgundy fs-5">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Server-Side Conflict Prevention & Concurrency</h6>
                <p className="small text-muted mb-0">
                  Every reservation checks existing active table bookings on the backend using overlapping interval algebra <code>[startTime &lt; newEndTime && endTime &gt; newStartTime]</code>, returning HTTP 409 Conflict if an overlap occurs.
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3">
              <div className="p-2 rounded bg-light text-burgundy fs-5">
                <i className="bi bi-diagram-3-fill"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">MongoDB Aggregation Analytics</h6>
                <p className="small text-muted mb-0">
                  Manager floor reports utilize real MongoDB aggregation pipelines (<code>$match</code>, <code>$group</code>, <code>$lookup</code>, <code>$sort</code>) for computing status distributions and daily reservation trends.
                </p>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3">
              <div className="p-2 rounded bg-light text-burgundy fs-5">
                <i className="bi bi-person-badge-fill"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1">Role-Based Access Control</h6>
                <p className="small text-muted mb-0">
                  Enforces strict authorization: diners manage only their own reservations, and restaurant managers maintain control only over assigned venues and floor tables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
