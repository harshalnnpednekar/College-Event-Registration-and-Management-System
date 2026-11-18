import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage({ showToast }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      showToast('Administrator privileges required.', 'error');
      navigate('/');
      return;
    }

    async function loadStats() {
      try {
        const res = await api.getAdminStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user, isAdmin]);

  if (loading) {
    return (
      <main className="container main-content">
        <div className="state-card">
          <div className="spinner"></div>
          <p>Calculating database metrics...</p>
        </div>
      </main>
    );
  }

  const { total_events, total_capacity, available_capacity, total_registrations, total_students, categories } = stats || {
    total_events: 0,
    total_capacity: 0,
    available_capacity: 0,
    total_registrations: 0,
    total_students: 0,
    categories: []
  };

  const bookedSeats = total_capacity - available_capacity;
  const utilization = total_capacity > 0 ? Math.round((bookedSeats / total_capacity) * 100) : 0;

  return (
    <main className="container main-content">
      <div className="admin-header">
        <div>
          <span className="hero-badge">Admin Control Panel</span>
          <h1 className="details-title">College Events & Analytics Dashboard</h1>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/events" className="btn btn-primary">
            + Create New Event
          </Link>
          <Link to="/admin/registrations" className="btn btn-secondary">
            View All Registrations
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-ribbon" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
        <div className="stat-card" style={{ background: '#1e293b' }}>
          <div className="stat-num">{total_events}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card" style={{ background: '#1e293b' }}>
          <div className="stat-num">{total_registrations}</div>
          <div className="stat-label">Total Registrations</div>
        </div>
        <div className="stat-card" style={{ background: '#1e293b' }}>
          <div className="stat-num">{total_students}</div>
          <div className="stat-label">Registered Students</div>
        </div>
        <div className="stat-card" style={{ background: '#1e293b' }}>
          <div className="stat-num">{utilization}%</div>
          <div className="stat-label">Seat Utilization</div>
        </div>
      </div>

      <div className="admin-grid">
        {/* Capacity Breakdown */}
        <div className="card-box">
          <h3 className="section-title">📊 Campus Capacity Overview</h3>
          <div className="capacity-stat-rows">
            <div className="cap-row">
              <span>Total Sanctioned Seats:</span>
              <strong>{total_capacity} seats</strong>
            </div>
            <div className="cap-row">
              <span>Confirmed Registrations:</span>
              <strong style={{ color: 'var(--success)' }}>{bookedSeats} seats</strong>
            </div>
            <div className="cap-row">
              <span>Unoccupied Available Seats:</span>
              <strong style={{ color: 'var(--primary)' }}>{available_capacity} seats</strong>
            </div>
          </div>
          <div className="progress-track" style={{ height: '10px', marginTop: '1.25rem' }}>
            <div
              className="progress-fill green"
              style={{ width: `${utilization}%` }}
              title={`${utilization}% Booked`}
            ></div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card-box">
          <h3 className="section-title">🏷️ Events by Category</h3>
          {categories && categories.length > 0 ? (
            <div className="category-stat-list">
              {categories.map((c, i) => (
                <div key={i} className="cat-stat-item">
                  <span className={`category-badge category-${c.category}`}>{c.category}</span>
                  <strong>{c.count} Events</strong>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No category data available.</p>
          )}
        </div>
      </div>
    </main>
  );
}
