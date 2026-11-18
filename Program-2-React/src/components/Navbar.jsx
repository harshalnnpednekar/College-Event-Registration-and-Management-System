import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar({ registrationCount }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <div className="brand-icon">🎓</div>
          <div className="brand-text">
            <span className="brand-title">CampusPulse React</span>
            <span className="brand-badge">Program 2 &bull; React.js</span>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Events
          </NavLink>
          <NavLink 
            to="/register" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Register
          </NavLink>
          <NavLink 
            to="/my-registrations" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            My Registrations
            {registrationCount > 0 && (
              <span className="nav-counter-pill">{registrationCount}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
