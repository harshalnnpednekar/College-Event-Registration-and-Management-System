import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import EventListPage from './pages/EventListPage';
import EventDetailsPage from './pages/EventDetailsPage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import { INITIAL_EVENTS } from './data/mockEvents';

export default function App() {
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('react_events_p2');
      return stored ? JSON.parse(stored) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const stored = localStorage.getItem('react_regs_p2');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('react_events_p2', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('react_regs_p2', JSON.stringify(registrations));
    } catch (e) {
      console.error(e);
    }
  }, [registrations]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleRegister = (newReg) => {
    const targetEvent = events.find(e => Number(e.id) === Number(newReg.eventId));
    if (!targetEvent || targetEvent.available_seats <= 0) {
      showToast('Event has no remaining seats.', 'error');
      return false;
    }

    // Decrement available seats
    setEvents(prev => prev.map(ev => {
      if (Number(ev.id) === Number(newReg.eventId)) {
        const nextAvail = Math.max(0, ev.available_seats - 1);
        let nextStatus = ev.status;
        if (nextAvail === 0) nextStatus = 'Closed';
        else if (nextAvail <= 15) nextStatus = 'Fast Filling';
        return {
          ...ev,
          available_seats: nextAvail,
          status: nextStatus
        };
      }
      return ev;
    }));

    setRegistrations(prev => [newReg, ...prev]);
    showToast(`Successfully registered for "${targetEvent.title}"!`, 'success');
    return true;
  };

  const handleCancelRegistration = (regId, eventId) => {
    if (!window.confirm('Are you sure you want to cancel this registration? Your seat will be returned.')) {
      return;
    }

    setRegistrations(prev => prev.filter(r => r.id !== regId));

    // Restore available seat
    setEvents(prev => prev.map(ev => {
      if (Number(ev.id) === Number(eventId)) {
        const nextAvail = Math.min(ev.total_seats, ev.available_seats + 1);
        let nextStatus = ev.status;
        if (nextAvail > 15) nextStatus = 'Open';
        else if (nextAvail > 0) nextStatus = 'Fast Filling';
        return {
          ...ev,
          available_seats: nextAvail,
          status: nextStatus
        };
      }
      return ev;
    }));

    showToast('Registration cancelled. Your seat was freed.', 'warning');
  };

  return (
    <div className="app-shell">
      <Navbar registrationCount={registrations.length} />

      <Routes>
        <Route
          path="/"
          element={<EventListPage events={events} registrations={registrations} />}
        />
        <Route
          path="/events/:id"
          element={<EventDetailsPage events={events} registrations={registrations} />}
        />
        <Route
          path="/register"
          element={
            <StudentRegistrationPage
              events={events}
              registrations={registrations}
              onRegister={handleRegister}
            />
          }
        />
        <Route
          path="/register/:id"
          element={
            <StudentRegistrationPage
              events={events}
              registrations={registrations}
              onRegister={handleRegister}
            />
          }
        />
        <Route
          path="/my-registrations"
          element={
            <MyRegistrationsPage
              registrations={registrations}
              events={events}
              onCancelRegistration={handleCancelRegistration}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <footer className="footer">
        <div className="container footer-content">
          <p><strong>CampusPulse React</strong> &bull; College Event Registration and Management System</p>
          <p className="footer-sub">Program 2: React Functional Components, JSX, React Router, useState, useEffect.</p>
        </div>
      </footer>
    </div>
  );
}
