import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function EventDetailsPage({ events, registrations }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = events.find(e => String(e.id) === String(id));
  const isRegistered = registrations.some(r => String(r.eventId) === String(id));

  if (!event) {
    return (
      <main className="container main-content">
        <div className="state-card empty-card">
          <h2>Event Not Found</h2>
          <p>The event you are looking for does not exist or has been removed.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            &larr; Back to Events Catalog
          </Link>
        </div>
      </main>
    );
  }

  const { title, description, category, venue, event_date, total_seats, available_seats, status, speaker, organizer, tags, prerequisites } = event;

  const eventDate = new Date(event_date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

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
            <span className="info-icon">🎙️</span>
            <div>
              <div className="info-label">Keynote / Speaker</div>
              <div className="info-value">{speaker || 'College Guest Faculty'}</div>
            </div>
          </div>

          <div className="info-box">
            <span className="info-icon">🏛️</span>
            <div>
              <div className="info-label">Organizer</div>
              <div className="info-value">{organizer || 'Student Affairs'}</div>
            </div>
          </div>

          <div className="info-box">
            <span className="info-icon">🎟️</span>
            <div>
              <div className="info-label">Seat Capacity</div>
              <div className="info-value">
                {available_seats} remaining out of {total_seats} total seats
              </div>
            </div>
          </div>
        </div>

        {prerequisites && (
          <div className="prereq-box">
            <h4>📋 Prerequisites & Guidelines</h4>
            <p>{prerequisites}</p>
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="detail-tags" style={{ marginTop: '1.5rem' }}>
            {tags.map((t, idx) => (
              <span key={idx} className="detail-tag">#{t}</span>
            ))}
          </div>
        )}

        <div className="details-footer-actions">
          {isRegistered ? (
            <div className="registered-alert">
              <span>✓ You are officially registered for this event!</span>
              <Link to="/my-registrations" className="btn btn-outline btn-sm">
                View Ticket
              </Link>
            </div>
          ) : isClosed ? (
            <div className="closed-alert">
              <span>Registration for this event is currently full or closed.</span>
            </div>
          ) : (
            <Link to={`/register/${id}`} className="btn btn-primary btn-lg">
              Proceed to Student Registration &rarr;
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
