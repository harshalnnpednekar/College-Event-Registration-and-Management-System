import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function StudentRegistrationPage({ events, onRegister, registrations }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventId: id || '',
    studentName: '',
    studentRoll: '',
    studentEmail: '',
    studentPhone: '',
    studentDept: '',
    studentSemester: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (id) {
      setFormData(prev => ({ ...prev, eventId: id }));
    }
  }, [id]);

  const selectedEvent = events.find(e => String(e.id) === String(formData.eventId));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.eventId) {
      newErrors.eventId = 'Please select an event.';
    } else {
      const ev = events.find(e => String(e.id) === String(formData.eventId));
      if (!ev || ev.available_seats <= 0 || ev.status === 'Closed') {
        newErrors.eventId = 'Selected event has no available seats.';
      }
    }

    const nameRegex = /^[A-Za-z\s.]{3,50}$/;
    if (!formData.studentName.trim() || !nameRegex.test(formData.studentName.trim())) {
      newErrors.studentName = 'Name must be 3-50 characters with letters only.';
    }

    const rollRegex = /^[A-Za-z0-9\-_]{4,20}$/;
    if (!formData.studentRoll.trim() || !rollRegex.test(formData.studentRoll.trim())) {
      newErrors.studentRoll = 'Roll Number must be 4-20 alphanumeric characters.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.studentEmail.trim() || !emailRegex.test(formData.studentEmail.trim())) {
      newErrors.studentEmail = 'Valid college email is required.';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.studentPhone.trim() || !phoneRegex.test(formData.studentPhone.trim())) {
      newErrors.studentPhone = 'Enter a valid 10-digit mobile number.';
    }

    if (!formData.studentDept) {
      newErrors.studentDept = 'Please select your department.';
    }

    if (!formData.studentSemester) {
      newErrors.studentSemester = 'Please select your semester.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to event guidelines.';
    }

    // Duplicate check
    if (!newErrors.eventId && !newErrors.studentEmail) {
      const isDuplicate = registrations.some(
        r => String(r.eventId) === String(formData.eventId) &&
             r.studentEmail.toLowerCase() === formData.studentEmail.trim().toLowerCase()
      );
      if (isDuplicate) {
        setGeneralError('Duplicate registration: You have already registered for this event with this email.');
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulate short network delay
    await new Promise(r => setTimeout(r, 500));

    try {
      const success = onRegister({
        ...formData,
        eventId: Number(formData.eventId),
        id: Date.now(),
        timestamp: new Date().toISOString()
      });

      if (success) {
        navigate('/my-registrations');
      } else {
        setGeneralError('Registration could not be completed. Seat might no longer be available.');
      }
    } catch (err) {
      setGeneralError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container main-content">
      <div className="form-card-container">
        <div className="form-header">
          <h1 className="form-title">Student Event Registration</h1>
          <p className="form-subtitle">Complete your details to secure your seat for campus events.</p>
        </div>

        {generalError && (
          <div className="form-alert alert-error" role="alert">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="eventId">Choose Event <span className="required">*</span></label>
            <select
              id="eventId"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              className={errors.eventId ? 'invalid' : ''}
            >
              <option value="">-- Select an Event --</option>
              {events.map(ev => {
                const isFull = ev.available_seats <= 0 || ev.status === 'Closed';
                return (
                  <option key={ev.id} value={ev.id} disabled={isFull}>
                    {ev.title} ({ev.category}) - {isFull ? 'CLOSED' : `${ev.available_seats} seats remaining`}
                  </option>
                );
              })}
            </select>
            {selectedEvent && (
              <div className="form-hint">
                Venue: {selectedEvent.venue} &bull; {selectedEvent.available_seats} seats left
              </div>
            )}
            {errors.eventId && <div className="error-msg">{errors.eventId}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentName">Full Name <span className="required">*</span></label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                placeholder="e.g. John Doe"
                value={formData.studentName}
                onChange={handleChange}
                className={errors.studentName ? 'invalid' : ''}
              />
              {errors.studentName && <div className="error-msg">{errors.studentName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="studentRoll">Roll Number / Student ID <span className="required">*</span></label>
              <input
                type="text"
                id="studentRoll"
                name="studentRoll"
                placeholder="e.g. CS2026-042"
                value={formData.studentRoll}
                onChange={handleChange}
                className={errors.studentRoll ? 'invalid' : ''}
              />
              {errors.studentRoll && <div className="error-msg">{errors.studentRoll}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentEmail">College Email <span className="required">*</span></label>
              <input
                type="email"
                id="studentEmail"
                name="studentEmail"
                placeholder="e.g. student@college.edu"
                value={formData.studentEmail}
                onChange={handleChange}
                className={errors.studentEmail ? 'invalid' : ''}
              />
              {errors.studentEmail && <div className="error-msg">{errors.studentEmail}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="studentPhone">Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                id="studentPhone"
                name="studentPhone"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={formData.studentPhone}
                onChange={handleChange}
                className={errors.studentPhone ? 'invalid' : ''}
              />
              {errors.studentPhone && <div className="error-msg">{errors.studentPhone}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentDept">Department <span className="required">*</span></label>
              <select
                id="studentDept"
                name="studentDept"
                value={formData.studentDept}
                onChange={handleChange}
                className={errors.studentDept ? 'invalid' : ''}
              >
                <option value="">-- Select Department --</option>
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Management Studies (MBA)">Management Studies (MBA)</option>
              </select>
              {errors.studentDept && <div className="error-msg">{errors.studentDept}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="studentSemester">Semester <span className="required">*</span></label>
              <select
                id="studentSemester"
                name="studentSemester"
                value={formData.studentSemester}
                onChange={handleChange}
                className={errors.studentSemester ? 'invalid' : ''}
              >
                <option value="">-- Semester --</option>
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
                <option value="Semester 7">Semester 7</option>
                <option value="Semester 8">Semester 8</option>
              </select>
              {errors.studentSemester && <div className="error-msg">{errors.studentSemester}</div>}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span>I confirm that the details provided are accurate and I agree to event conduct guidelines.</span>
            </label>
            {errors.agreeTerms && <div className="error-msg">{errors.agreeTerms}</div>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Registering...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
