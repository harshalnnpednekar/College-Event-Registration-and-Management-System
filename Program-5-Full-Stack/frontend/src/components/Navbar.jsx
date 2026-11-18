import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand">
          <div className="brand-icon">🎓</div>
          <div className="brand-text">
            <span className="brand-title">CampusPulse Integrated</span>
            <span className="brand-badge">Program 5 &bull; Full-Stack React + Express + PostgreSQL</span>
          </div>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Events
          </NavLink>

          {user && !isAdmin && (
            <NavLink to="/my-bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Registrations
            </NavLink>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                📊 Dashboard
              </NavLink>
              <NavLink to="/admin/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                📅 Manage Events
              </NavLink>
              <NavLink to="/admin/registrations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                👥 Registrations
              </NavLink>
            </>
          )}

          <div className="nav-auth-section">
            {user ? (
              <div className="user-profile-badge">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div className="user-info-text">
                  <span className="user-name">{user.name}</span>
                  <span className={`user-role-pill role-${user.role}`}>{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log Out">
                  Logout
                </button>
              </div>
            ) : (
              <div className="guest-actions">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
