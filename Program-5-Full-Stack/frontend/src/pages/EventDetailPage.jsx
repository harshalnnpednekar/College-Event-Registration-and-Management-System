import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EventDetailPage({ showToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getEventById(id);
        if (res.success) {
          setEvent(res.data);
        }
        if (user) {
          const regs = await api.getMyRegistrations();
          if (regs.success) {
            setIsRegistered(regs.data.some(r => Number(r.event_id) === Number(id)));
          }
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      showToast('Please log in to register.', 'warning');
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      const res = await api.registerForEvent(id);
      if (res.success) {
        showToast('Registration confirmed successfully!', 'success');
        setIsRegistered(true);
        // refresh event to get updated seat count
        const updated = await api.getEventById(id);
        if (updated.success) setEvent(updated.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <main className="container main-content">
        <div className="state-card">
          <div className="spinner"></div>
          <p>Loading event information...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="container main-content">
        <div className="state-card empty-card">
          <h2>Event Not Found</h2>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            &larr; Return to Events
          </Link>
        </div>
      </main>
    );
  }

  const { title, description, category, venue, event_date, total_seats, available_seats, status } = event;
  const eventDate = new Date(event_date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const isClosed = available_seats <= 0 || status === 'Closed';

  return (
    <main className="container main-content">
      <div className="details-page-card">
        <div className="details-header-bar">
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
            &larr; Back
          </button>
          <div className="header-badges">
            <span className={`category-badge category-${category}`}>{category}</span>
            <span className={`status-badge status-${status.replace(/\s+/g, '-')}`}>{status}</span>
          </div>
        </div>

        <h1 className="details-title">{title}</h1>
        <p className="details-lead">{description}</p>

        <div className="details-info-grid">
          <div className="info-box">
            <span className="info-icon">📅</span>
            <div>
              <div className="info-label">Date & Time</div>
              <div className="info-value">{formattedDate} &bull; {formattedTime}</div>
            </div>
          </div>

          <div className="info-box">
            <span className="info-icon">📍</span>
            <div>
              <div className="info-label">Venue</div>
              <div className="info-value">{venue}</div>
            </div>
          </div>

          <div className="info-box">
            <span className="info-icon">🎟️</span>
            <div>
              <div className="info-label">Seat Capacity</div>
              <div className="info-value">
                {available_seats} remaining out of {total_seats} seats
              </div>
            </div>
          </div>
        </div>

        <div className="details-footer-actions">
          {isRegistered ? (
            <div className="registered-alert">
              <span>✓ You are officially registered for this event!</span>
              <Link to="/my-bookings" className="btn btn-outline btn-sm">
                View My Pass
              </Link>
            </div>
          ) : isClosed ? (
            <div className="closed-alert">
              <span>Registration closed: Maximum capacity reached.</span>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleRegister}
              disabled={registering}
            >
              {registering ? 'Reserving Seat...' : 'Reserve Seat Now'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
