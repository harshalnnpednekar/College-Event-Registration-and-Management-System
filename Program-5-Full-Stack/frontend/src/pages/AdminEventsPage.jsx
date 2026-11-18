import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminEventsPage({ showToast }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    venue: '',
    event_date: '',
    total_seats: 50,
    status: 'Open'
  });

  const fetchEvents = async () => {
    try {
      const res = await api.getEvents();
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) {
      showToast('Admin access required.', 'error');
      navigate('/');
      return;
    }
    fetchEvents();
  }, [user, isAdmin]);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: 'Technical',
      venue: '',
      event_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
      total_seats: 60,
      status: 'Open'
    });
    setShowModal(true);
  };

  const openEditModal = (ev) => {
    setEditingEvent(ev);
    setFormData({
      title: ev.title,
      description: ev.description || '',
      category: ev.category,
      venue: ev.venue,
      event_date: new Date(ev.event_date).toISOString().slice(0, 16),
      total_seats: ev.total_seats,
      status: ev.status
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, formData);
        showToast('Event updated successfully!', 'success');
      } else {
        await api.createEvent(formData);
        showToast('New event created successfully!', 'success');
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete event "${title}"? All existing student registrations will be removed.`)) {
      return;
    }

    try {
      await api.deleteEvent(id);
      showToast(`Event "${title}" deleted.`, 'warning');
      fetchEvents();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <main className="container main-content">
      <div className="admin-header">
        <div>
          <h1 className="details-title">Campus Event Management</h1>
          <p className="details-lead">Create, update, monitor capacity, or remove college events.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add New Event
        </button>
      </div>

      {loading ? (
        <div className="state-card">
          <div className="spinner"></div>
          <p>Loading events from database...</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title & Category</th>
                <th>Venue</th>
                <th>Event Date</th>
                <th>Seats (Avail/Total)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td><strong>#{ev.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{ev.title}</div>
                    <span className={`category-badge category-${ev.category}`}>{ev.category}</span>
                  </td>
                  <td>{ev.venue}</td>
                  <td>{new Date(ev.event_date).toLocaleDateString()}</td>
                  <td>
                    <strong>{ev.available_seats}</strong> / {ev.total_seats}
                  </td>
                  <td>
                    <span className={`status-badge status-${ev.status.replace(/\s+/g, '-')}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(ev)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ev.id, ev.title)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-backdrop show">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="evtTitle">Title *</label>
                  <input
                    type="text"
                    id="evtTitle"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="evtDesc">Description</label>
                  <textarea
                    id="evtDesc"
                    rows={3}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="evtCat">Category *</label>
                    <select
                      id="evtCat"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Technical">Technical</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Sports">Sports</option>
                      <option value="Seminar">Seminar</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="evtSeats">Total Capacity *</label>
                    <input
                      type="number"
                      id="evtSeats"
                      min={1}
                      value={formData.total_seats}
                      onChange={(e) => setFormData({ ...formData, total_seats: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="evtVenue">Venue *</label>
                    <input
                      type="text"
                      id="evtVenue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="evtDate">Date & Time *</label>
                    <input
                      type="datetime-local"
                      id="evtDate"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {editingEvent && (
                  <div className="form-group">
                    <label htmlFor="evtStatus">Status</label>
                    <select
                      id="evtStatus"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Open">Open</option>
                      <option value="Fast Filling">Fast Filling</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
