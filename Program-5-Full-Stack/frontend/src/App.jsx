import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminRegistrationsPage from './pages/AdminRegistrationsPage';

export default function App() {
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage showToast={showToast} />} />
        <Route path="/events/:id" element={<EventDetailPage showToast={showToast} />} />
        <Route path="/login" element={<LoginPage showToast={showToast} />} />
        <Route path="/register" element={<RegisterPage showToast={showToast} />} />
        <Route path="/my-bookings" element={<MyBookingsPage showToast={showToast} />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage showToast={showToast} />} />
        <Route path="/admin/events" element={<AdminEventsPage showToast={showToast} />} />
        <Route path="/admin/registrations" element={<AdminRegistrationsPage showToast={showToast} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <footer className="footer">
        <div className="container footer-content">
          <p><strong>CampusPulse Integrated Portal</strong> &bull; College Event Registration and Management System</p>
          <p className="footer-sub">Program 5: Integrated Full-Stack Application (React + Express + PostgreSQL with ACID Transactions).</p>
        </div>
      </footer>
    </div>
  );
}
