import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage({ showToast }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'All',
    sortBy: 'date-asc'
  });

  const fetchEvents = async () => {
    try {
      const res = await api.getEvents(filters);
      if (res.success) {
        setEvents(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    if (!user) return;
    try {
      const res = await api.getMyRegistrations();
      if (res.success) {
        setMyRegistrations(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch registrations:', err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  useEffect(() => {
    fetchMyBookings();
  }, [user]);

  const registeredEventIds = useMemo(() => {
    return new Set(myRegistrations.map(r => Number(r.event_id)));
  }, [myRegistrations]);

  const handleRegister = async (eventId) => {
    if (!user) {
      showToast('Please log in or sign up to register for campus events.', 'warning');
      navigate('/login');
      return;
    }

    setRegisteringId(eventId);
    try {
      const res = await api.registerForEvent(eventId);
      if (res.success) {
        showToast(res.message || 'Successfully registered for event!', 'success');
        await fetchEvents();
        await fetchMyBookings();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  const totalSeats = useMemo(() => events.reduce((sum, e) => sum + Number(e.total_seats || 0), 0), [events]);
  const availSeats = useMemo(() => events.reduce((sum, e) => sum + Number(e.available_seats || 0), 0), [events]);

  return (
    <div className="home-container">
      {/* Hero */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-badge">Enterprise Full-Stack System &bull; PostgreSQL</div>
          <h1 className="hero-title">College Event Registration & Management</h1>
          <p className="hero-subtitle">
            Seamlessly browse, book, and manage campus events with strict relational database integrity, 
            JWT authentication, and ACID transaction seat safety.
          </p>

          <div className="stats-ribbon">
            <div className="stat-card">
              <div className="stat-num">{events.length}</div>
              <div className="stat-label">Total Events</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{totalSeats}</div>
              <div className="stat-label">Total Seats</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{availSeats}</div>
              <div className="stat-label">Seats Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{myRegistrations.length}</div>
              <div className="stat-label">My Bookings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container main-content">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onReset={() => setFilters({ search: '', category: 'All', status: 'All', sortBy: 'date-asc' })}
        />

        <div className="results-meta">
          <span>Displaying {events.length} live campus events</span>
        </div>

        {loading ? (
          <div className="state-card">
            <div className="spinner"></div>
            <p>Fetching events from PostgreSQL database...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="state-card empty-card">
            <div className="empty-icon">📅</div>
            <h3>No events found</h3>
            <p>Try modifying your category or search filter criteria.</p>
          </div>
        ) : (
          <div className="event-grid">
            {events.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                isRegistered={registeredEventIds.has(Number(ev.id))}
                onRegister={handleRegister}
                isRegistering={registeringId === ev.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
