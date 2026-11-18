import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminRegistrationsPage({ showToast }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  const fetchRegistrations = async () => {
    try {
      const res = await api.getAllRegistrations();
      if (res.success) {
        setRegistrations(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) {
      showToast('Admin privilege required.', 'error');
      navigate('/');
      return;
    }
    fetchRegistrations();
  }, [user, isAdmin]);

  const filtered = registrations.filter(r => {
    const q = filterQuery.toLowerCase();
    return (
      (r.student_name && r.student_name.toLowerCase().includes(q)) ||
      (r.student_email && r.student_email.toLowerCase().includes(q)) ||
      (r.event_title && r.event_title.toLowerCase().includes(q))
    );
  });

  return (
    <main className="container main-content">
      <div className="admin-header">
        <div>
          <h1 className="details-title">All Student Registrations</h1>
          <p className="details-lead">Comprehensive audit of student bookings across all college events.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Export / Print Table
        </button>
      </div>

      <div className="search-box" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Filter by student name, college email, or event title..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="state-card">
          <div className="spinner"></div>
          <p>Loading registrations from PostgreSQL...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="state-card empty-card">
          <div className="empty-icon">📋</div>
          <h3>No registrations found</h3>
          <p>No student bookings match your filter criteria.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reg ID</th>
                <th>Student Name</th>
                <th>College Email</th>
                <th>Event Booked</th>
                <th>Category</th>
                <th>Registration Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><strong>#{r.id}</strong></td>
                  <td><strong>{r.student_name}</strong></td>
                  <td>{r.student_email}</td>
                  <td>{r.event_title}</td>
                  <td>
                    <span className={`category-badge category-${r.category}`}>{r.category}</span>
                  </td>
                  <td>{new Date(r.registration_date).toLocaleString()}</td>
                  <td>
                    <span className="status-badge status-Open">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
