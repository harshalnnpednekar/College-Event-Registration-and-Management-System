import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyBookingsPage({ showToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.getMyRegistrations();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this event registration? Your seat will be freed.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await api.cancelRegistration(bookingId);
      if (res.success) {
        showToast(res.message || 'Registration cancelled and seat restored.', 'warning');
        await fetchBookings();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="container main-content">
      <div className="my-regs-header">
        <div>
          <h1 className="details-title">My Registered Events</h1>
          <p className="details-lead">Manage your bookings, download entrance passes, or cancel registrations.</p>
        </div>
        {bookings.length > 0 && (
          <button className="btn btn-secondary" onClick={() => window.print()}>
            🖨️ Print All Passes
          </button>
        )}
      </div>

      {loading ? (
        <div className="state-card">
          <div className="spinner"></div>
          <p>Retrieving your confirmed registrations...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="state-card empty-card">
          <div className="empty-icon">🎟️</div>
          <h2>No Active Registrations Found</h2>
          <p>You haven't reserved a seat for any campus events yet.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Explore Available Events
          </Link>
        </div>
      ) : (
        <div className="regs-grid">
          {bookings.map(item => {
            const eventDate = new Date(item.event_date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={item.id} className="ticket-card">
                <div className="ticket-header">
                  <div>
                    <span className={`category-badge category-${item.category}`}>{item.category}</span>
                    <h3 className="ticket-title">{item.title}</h3>
                  </div>
                  <span className="ticket-pass-id">#PASS-{item.id}</span>
                </div>

                <div className="ticket-body">
                  <div className="ticket-detail-row">
                    <span>📅 Date:</span>
                    <strong>{formattedDate}</strong>
                  </div>
                  <div className="ticket-detail-row">
                    <span>📍 Venue:</span>
                    <strong>{item.venue}</strong>
                  </div>
                  <div className="ticket-detail-row">
                    <span>👤 Student:</span>
                    <strong>{user.name}</strong>
                  </div>
                  <div className="ticket-detail-row">
                    <span>✉️ Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span>⏱️ Booked:</span>
                    <span>{new Date(item.registration_date).toLocaleString()}</span>
                  </div>
                </div>

                <div className="ticket-footer">
                  <span className="status-badge status-Open">Confirmed</span>
                  <div className="ticket-actions">
                    <Link to={`/events/${item.event_id}`} className="btn btn-secondary btn-sm">
                      Details
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancel(item.id)}
                      disabled={cancellingId === item.id}
                    >
                      {cancellingId === item.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
