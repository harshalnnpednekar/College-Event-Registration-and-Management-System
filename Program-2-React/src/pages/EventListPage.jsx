import React, { useState, useMemo } from 'react';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';

export default function EventListPage({ events, registrations }) {
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    status: 'All',
    sortBy: 'date-asc'
  });

  const handleReset = () => {
    setFilters({
      search: '',
      category: 'All',
      status: 'All',
      sortBy: 'date-asc'
    });
  };

  const registeredEventIds = useMemo(() => {
    return new Set(registrations.map(r => Number(r.eventId)));
  }, [registrations]);

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(ev => 
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        (ev.speaker && ev.speaker.toLowerCase().includes(q)) ||
        (ev.tags && ev.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (filters.category !== 'All') {
      result = result.filter(ev => ev.category === filters.category);
    }

    if (filters.status !== 'All') {
      result = result.filter(ev => ev.status === filters.status);
    }

    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-asc':
          return new Date(a.event_date) - new Date(b.event_date);
        case 'date-desc':
          return new Date(b.event_date) - new Date(a.event_date);
        case 'seats-desc':
          return b.available_seats - a.available_seats;
        case 'seats-asc':
          return a.available_seats - b.available_seats;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [events, filters]);

  // Overall statistics
  const totalSeats = useMemo(() => events.reduce((sum, e) => sum + Number(e.total_seats || 0), 0), [events]);
  const availableSeats = useMemo(() => events.reduce((sum, e) => sum + Number(e.available_seats || 0), 0), [events]);

  return (
    <div className="event-list-container">
      {/* Hero Header */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-badge">React.js Single Page Application</div>
          <h1 className="hero-title">Campus Event Directory & Registration</h1>
          <p className="hero-subtitle">
            Browse upcoming workshops, hackathons, and cultural fests. State management powered by React hooks and client-side routing.
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
              <div className="stat-num">{availableSeats}</div>
              <div className="stat-label">Seats Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{registrations.length}</div>
              <div className="stat-label">My Registrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="container main-content">
        <FilterBar filters={filters} setFilters={setFilters} onReset={handleReset} />

        <div className="results-meta">
          <span>Showing {filteredEvents.length} of {events.length} events</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="state-card empty-card">
            <div className="empty-icon">🔍</div>
            <h3>No matching events found</h3>
            <p>Try modifying your search or reset the filters.</p>
            <button className="btn btn-secondary" onClick={handleReset}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="event-grid">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registeredEventIds.has(Number(event.id))}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
