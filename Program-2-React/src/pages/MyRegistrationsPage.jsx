import React from 'react';
import { Link } from 'react-router-dom';

export default function MyRegistrationsPage({ registrations, events, onCancelRegistration }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="container main-content">
      <div className="my-regs-header">
        <div>
          <h1 className="details-title">My Event Registrations</h1>
          <p className="details-lead">Manage your event bookings, print registration passes, or cancel bookings.</p>
        </div>
        {registrations.length > 0 && (
          <button className="btn btn-secondary" onClick={handlePrint}>
            🖨️ Print Pass
          </button>
        )}
      </div>

      {registrations.length === 0 ? (
        <div className="state-card empty-card">
          <div className="empty-icon">🎟️</div>
          <h2>No Registrations Found</h2>
          <p>You have not registered for any events yet. Explore upcoming hackathons, fests, and workshops!</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Events Catalog
          </Link>
        </div>
      ) : (
        <div className="regs-grid">
          {registrations.map(reg => {
            const ev = events.find(e => Number(e.id) === Number(reg.eventId)) || {
              title: 'College Event',
              category: 'General',
              venue: 'Main Campus',
              event_date: new Date().toISOString()
            };

            const eventDate = new Date(ev.event_date);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={reg.id} className="ticket-card">
                <div className="ticket-header">
                  <div>
                    <span className={`category-badge category-${ev.category}`}>{ev.category}</span>
                    <h3 className="ticket-title">{ev.title}</h3>
                  </div>
                  <span className="ticket-pass-id">#PASS-{reg.id.toString().slice(-6)}</span>
                </div>

                <div className="ticket-body">
                  <div className="ticket-detail-row">
                    <span>📅 Date & Time:</span>
                    <strong>{formattedDate}</strong>
                  </div>
                  <div className="ticket-detail-row">
                    <span>📍 Venue:</span>
                    <strong>{ev.venue}</strong>
                  </div>
                  <div className="ticket-detail-row">
                    <span>👤 Student:</span>
                    <strong>{reg.studentName} ({reg.studentRoll})</strong>
                  </div>
                  <div className="ticket-detail-row">
                    <span>🎓 Department:</span>
                    <span>{reg.studentDept} ({reg.studentSemester})</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span>✉️ Email / Phone:</span>
                    <span>{reg.studentEmail} &bull; {reg.studentPhone}</span>
                  </div>
                  <div className="ticket-detail-row">
                    <span>⏱️ Booked At:</span>
                    <span>{new Date(reg.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="ticket-footer">
                  <span className="status-badge status-Open">Confirmed</span>
                  <div className="ticket-actions">
                    <Link to={`/events/${reg.eventId}`} className="btn btn-secondary btn-sm">
                      Event Info
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onCancelRegistration(reg.id, reg.eventId)}
                    >
                      Cancel Booking
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
