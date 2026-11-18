import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ showToast }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login(formData.email, formData.password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container main-content">
      <div className="form-card-container">
        <div className="form-header">
          <h1 className="form-title">Account Login</h1>
          <p className="form-subtitle">Enter your college credentials to access your event dashboard.</p>
        </div>

        {error && (
          <div className="form-alert alert-error" role="alert">
            {error}
          </div>
        )}

        {/* Quick Fill Test Accounts */}
        <div className="quick-fill-box">
          <span className="quick-fill-title">Quick Demo Logins:</span>
          <div className="quick-fill-btns">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickFill('admin@college.edu', 'Admin@123')}
            >
              👑 Fill Admin (admin@college.edu)
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickFill('john.doe@college.edu', 'Student@123')}
            >
              🎓 Fill Student (john.doe@college.edu)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">College Email Address <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. name@college.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password <span className="required">*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="form-footer-note">
          Don't have an account yet? <Link to="/register">Register here as a student</Link>
        </div>
      </div>
    </main>
  );
}
