import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ event, isRegistered }) {
  const { id, title, description, category, venue, event_date, total_seats, available_seats, status, speaker } = event;

  const eventDate = new Date(event_date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const total = Number(total_seats) || 1;
  const avail = Number(available_seats);
  const filledPercent = Math.min(100, Math.max(0, Math.round(((total - avail) / total) * 100)));

  let progressColor = 'green';
  if (avail === 0) progressColor = 'red';
  else if (avail <= 15) progressColor = 'amber';

  const isClosed = avail <= 0 || status === 'Closed';

  return (
    <article className="event-card">
      <div className="card-header">
        <span className={`category-badge category-${category}`}>{category}</span>
        <span className={`status-badge status-${status.replace(/\s+/g, '-')}`}>{status}</span>
      </div>

      <h3 className="event-title">{title}</h3>
      <p className="event-desc">{description}</p>

      <div className="event-meta">
        <div className="meta-row">
          <span className="meta-icon">📅</span>
          <span>{formattedDate} &bull; {formattedTime}</span>
        </div>
        <div className="meta-row">
          <span className="meta-icon">📍</span>
          <span>{venue}</span>
        </div>
        {speaker && (
          <div className="meta-row">
            <span className="meta-icon">🎙️</span>
            <span>{speaker}</span>
          </div>
        )}
      </div>

      <div className="seat-progress-box">
        <div className="seat-progress-label">
          <span>Seats: {avail} / {total} available</span>
          <span>{filledPercent}% filled</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${progressColor}`} style={{ width: `${filledPercent}%` }}></div>
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/events/${id}`} className="btn btn-secondary">
          Details
        </Link>
        {isRegistered ? (
          <button className="btn btn-primary" disabled>
            ✓ Registered
          </button>
        ) : isClosed ? (
          <button className="btn btn-primary" disabled>
            Sold Out
          </button>
        ) : (
          <Link to={`/register/${id}`} className="btn btn-primary">
            Register
          </Link>
        )}
      </div>
    </article>
  );
}
