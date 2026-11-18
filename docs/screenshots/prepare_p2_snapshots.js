const fs = require('fs');
const path = require('path');

const css = fs.readFileSync('Program-2-React/src/index.css', 'utf8');

// Base HTML Wrapper
function wrapPage(title, contentHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} | Program 2 (React.js)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <style>
    ${css}
  </style>
</head>
<body>
  <div class="app-shell">
    <!-- Navbar -->
    <header class="navbar">
      <div class="nav-container">
        <div class="brand">
          <div class="brand-icon">🎓</div>
          <div class="brand-text">
            <span class="brand-title">CampusPulse React</span>
            <span class="brand-badge">Program 2 &bull; React.js (CO3)</span>
          </div>
        </div>
        <nav class="nav-links">
          <a href="#" class="nav-link active">Events</a>
          <a href="#" class="nav-link">Register</a>
          <a href="#" class="nav-link">
            My Registrations
            <span class="nav-counter-pill">1</span>
          </a>
        </nav>
      </div>
    </header>

    ${contentHtml}

    <footer class="footer">
      <div class="container footer-content">
        <p><strong>CampusPulse React</strong> &bull; College Event Registration and Management System</p>
        <p class="footer-sub">Program 2: React Functional Components, JSX, React Router, useState, useEffect &bull; Roll No: 41</p>
      </div>
    </footer>
  </div>
</body>
</html>`;
}

// 1. View: Event Listing Page (/)
const eventListHtml = `
  <section class="hero-section">
    <div class="container hero-content">
      <div class="hero-badge">React.js Single Page Application &bull; B.E. (AI & DS)</div>
      <h1 class="hero-title">Campus Event Directory & Registration</h1>
      <p class="hero-subtitle">
        Browse upcoming workshops, hackathons, and cultural fests. State management powered by React hooks and client-side routing.
      </p>

      <div class="stats-ribbon">
        <div class="stat-card">
          <div class="stat-num">6</div>
          <div class="stat-label">Total Events</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">960</div>
          <div class="stat-label">Total Seats</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">185</div>
          <div class="stat-label">Seats Available</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">1</div>
          <div class="stat-label">My Registrations</div>
        </div>
      </div>
    </div>
  </section>

  <main class="container main-content">
    <section class="filter-panel" aria-label="Event filters">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search by title, speaker, venue or keywords..." value="">
      </div>
      <div class="filter-controls">
        <div class="filter-group">
          <label>Category:</label>
          <select><option>All Categories</option><option>Technical</option><option>Cultural</option><option>Workshop</option></select>
        </div>
        <div class="filter-group">
          <label>Status:</label>
          <select><option>All Statuses</option><option>Open</option><option>Fast Filling</option><option>Closed</option></select>
        </div>
        <div class="filter-group">
          <label>Sort By:</label>
          <select><option>Date (Earliest First)</option><option>Seats Available (High to Low)</option></select>
        </div>
        <button class="btn btn-outline">Reset</button>
      </div>
    </section>

    <div class="results-meta">
      <span>Showing 6 of 6 events</span>
    </div>

    <div class="event-grid">
      <!-- Card 1 -->
      <article class="event-card">
        <div class="card-header">
          <span class="category-badge category-Technical">Technical</span>
          <span class="status-badge status-Open">Open</span>
        </div>
        <h3 class="event-title">National Hackathon 2026: CodeCrafters</h3>
        <p class="event-desc">36-hour non-stop hackathon challenging students to build innovative AI, Web3, and IoT solutions for real-world problems.</p>
        <div class="event-meta">
          <div class="meta-row"><span class="meta-icon">📅</span><span>Fri, Nov 20, 2026 &bull; 09:00 AM</span></div>
          <div class="meta-row"><span class="meta-icon">📍</span><span>Campus Innovation Hub & Lab 4</span></div>
          <div class="meta-row"><span class="meta-icon">🎙️</span><span>Dr. Sarah Jenkins (Lead AI Architect)</span></div>
        </div>
        <div class="seat-progress-box">
          <div class="seat-progress-label"><span>Seats: 24 / 120 available</span><span>80% filled</span></div>
          <div class="progress-track"><div class="progress-fill green" style="width: 80%"></div></div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary">Details</button>
          <button class="btn btn-primary">Register</button>
        </div>
      </article>

      <!-- Card 2 -->
      <article class="event-card">
        <div class="card-header">
          <span class="category-badge category-Cultural">Cultural</span>
          <span class="status-badge status-Open">Open</span>
        </div>
        <h3 class="event-title">Aura 2026: Annual Inter-College Cultural Fest</h3>
        <p class="event-desc">A vibrant celebration of music, dance, theatrical acts, photography exhibitions, and battle of the college bands.</p>
        <div class="event-meta">
          <div class="meta-row"><span class="meta-icon">📅</span><span>Wed, Nov 25, 2026 &bull; 05:00 PM</span></div>
          <div class="meta-row"><span class="meta-icon">📍</span><span>Main University Auditorium</span></div>
          <div class="meta-row"><span class="meta-icon">🎙️</span><span>Cultural Committee & Guests</span></div>
        </div>
        <div class="seat-progress-box">
          <div class="seat-progress-label"><span>Seats: 85 / 500 available</span><span>83% filled</span></div>
          <div class="progress-track"><div class="progress-fill green" style="width: 83%"></div></div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary">Details</button>
          <button class="btn btn-primary">Register</button>
        </div>
      </article>

      <!-- Card 3 -->
      <article class="event-card">
        <div class="card-header">
          <span class="category-badge category-Workshop">Workshop</span>
          <span class="status-badge status-Fast-Filling">Fast Filling</span>
        </div>
        <h3 class="event-title">Generative AI & LLM Systems Hands-on Workshop</h3>
        <p class="event-desc">Master prompt engineering, retrieval-augmented generation (RAG), vector embeddings, and LangChain integration.</p>
        <div class="event-meta">
          <div class="meta-row"><span class="meta-icon">📅</span><span>Sun, Nov 22, 2026 &bull; 10:30 AM</span></div>
          <div class="meta-row"><span class="meta-icon">📍</span><span>Computer Center Room 201</span></div>
          <div class="meta-row"><span class="meta-icon">🎙️</span><span>Prof. Alan Verma (AI Faculty)</span></div>
        </div>
        <div class="seat-progress-box">
          <div class="seat-progress-label"><span>Seats: 4 / 60 available</span><span>93% filled</span></div>
          <div class="progress-track"><div class="progress-fill amber" style="width: 93%"></div></div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary">Details</button>
          <button class="btn btn-primary">Register</button>
        </div>
      </article>
    </div>
  </main>
`;

// 2. View: Event Details Page (/events/:id)
const eventDetailsHtml = `
  <main class="container main-content">
    <div class="details-page-card">
      <div class="details-header-bar">
        <button class="btn btn-secondary btn-sm">&larr; Back to Events</button>
        <div class="header-badges">
          <span class="category-badge category-Technical">Technical</span>
          <span class="status-badge status-Open">Open</span>
        </div>
      </div>

      <h1 class="details-title">National Hackathon 2026: CodeCrafters</h1>
      <p class="details-lead">
        36-hour non-stop hackathon challenging students to build innovative AI, Web3, and IoT solutions for real-world problems.
      </p>

      <div class="details-info-grid">
        <div class="info-box">
          <span class="info-icon">📅</span>
          <div>
            <div className="info-label">Date & Time</div>
            <div class="info-value">Friday, November 20, 2026 &bull; 09:00 AM</div>
          </div>
        </div>
        <div class="info-box">
          <span class="info-icon">📍</span>
          <div>
            <div class="info-label">Venue</div>
            <div class="info-value">Campus Innovation Hub & Lab 4</div>
          </div>
        </div>
        <div class="info-box">
          <span class="info-icon">🎙️</span>
          <div>
            <div class="info-label">Keynote Speaker</div>
            <div class="info-value">Dr. Sarah Jenkins (Lead AI Architect)</div>
          </div>
        </div>
        <div class="info-box">
          <span class="info-icon">🏛️</span>
          <div>
            <div class="info-label">Department Organizer</div>
            <div class="info-value">Artificial Intelligence and Data Science</div>
          </div>
        </div>
        <div class="info-box">
          <span class="info-icon">🎟️</span>
          <div>
            <div class="info-label">Capacity Status</div>
            <div class="info-value">24 remaining out of 120 total seats</div>
          </div>
        </div>
      </div>

      <div class="prereq-box">
        <h4>📋 Prerequisites & Guidelines</h4>
        <p>Laptop, GitHub account, basic programming proficiency. Bring your college student ID card for physical access.</p>
      </div>

      <div class="detail-tags">
        <span class="detail-tag">#Coding</span>
        <span class="detail-tag">#AI</span>
        <span class="detail-tag">#TeamEvent</span>
        <span class="detail-tag">#Prizes</span>
      </div>

      <div class="details-footer-actions">
        <button class="btn btn-primary btn-lg">
          Proceed to Student Registration &rarr;
        </button>
      </div>
    </div>
  </main>
`;

// 3. View: Student Registration Page (/register/:id)
const studentRegHtml = `
  <main class="container main-content">
    <div class="form-card-container">
      <div class="form-header">
        <h1 class="form-title">Student Event Registration</h1>
        <p class="form-subtitle">Complete your student details to secure your registration pass.</p>
      </div>

      <form>
        <div class="form-group">
          <label>Selected Event <span class="required">*</span></label>
          <select disabled>
            <option>National Hackathon 2026: CodeCrafters (Technical) - 24 seats remaining</option>
          </select>
          <div class="form-hint">Venue: Campus Innovation Hub & Lab 4 &bull; 24 seats left</div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Full Name <span class="required">*</span></label>
            <input type="text" value="Alex Rivera" readonly>
          </div>
          <div class="form-group">
            <label>Roll Number / Student ID <span class="required">*</span></label>
            <input type="text" value="AI2026-041 (Roll No: 41)" readonly>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>College Email <span class="required">*</span></label>
            <input type="email" value="alex.rivera@college.edu" readonly>
          </div>
          <div class="form-group">
            <label>Phone Number <span class="required">*</span></label>
            <input type="tel" value="9876543210" readonly>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Department <span class="required">*</span></label>
            <select disabled>
              <option>Artificial Intelligence and Data Science</option>
            </select>
          </div>
          <div class="form-group">
            <label>Semester <span class="required">*</span></label>
            <select disabled>
              <option>Semester 5 (Sem V)</option>
            </select>
          </div>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" checked disabled>
            <span>I confirm that the details provided are accurate and I agree to event conduct guidelines.</span>
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary">Cancel</button>
          <button type="button" class="btn btn-primary">Confirm Registration</button>
        </div>
      </form>
    </div>
  </main>
`;

// 4. View: My Registrations Page (/my-registrations)
const myRegsHtml = `
  <main class="container main-content">
    <div class="my-regs-header">
      <div>
        <h1 class="details-title">My Event Registrations</h1>
        <p class="details-lead">Manage your event bookings, print registration passes, or cancel bookings.</p>
      </div>
      <button class="btn btn-secondary">
        🖨️ Print Pass
      </button>
    </div>

    <div class="regs-grid">
      <!-- Pass 1 -->
      <div class="ticket-card">
        <div class="ticket-header">
          <div>
            <span class="category-badge category-Technical">Technical</span>
            <h3 class="ticket-title">National Hackathon 2026: CodeCrafters</h3>
          </div>
          <span class="ticket-pass-id">#PASS-000041</span>
        </div>

        <div class="ticket-body">
          <div class="ticket-detail-row">
            <span>📅 Date & Time:</span>
            <strong>Fri, Nov 20, 2026 &bull; 09:00 AM</strong>
          </div>
          <div class="ticket-detail-row">
            <span>📍 Venue:</span>
            <strong>Campus Innovation Hub & Lab 4</strong>
          </div>
          <div class="ticket-detail-row">
            <span>👤 Student:</span>
            <strong>Alex Rivera (Roll No: 41)</strong>
          </div>
          <div class="ticket-detail-row">
            <span>🎓 Department:</span>
            <span>B.E. (AI & DS) &bull; Semester 5</span>
          </div>
          <div class="ticket-detail-row">
            <span>✉️ College Email:</span>
            <span>alex.rivera@college.edu</span>
          </div>
          <div class="ticket-detail-row">
            <span>⏱️ Booking Timestamp:</span>
            <span>15/11/2026, 04:20:00 PM</span>
          </div>
        </div>

        <div class="ticket-footer">
          <span class="status-badge status-Open">Confirmed</span>
          <div class="ticket-actions">
            <button class="btn btn-secondary btn-sm">Event Info</button>
            <button class="btn btn-danger btn-sm">Cancel Booking</button>
          </div>
        </div>
      </div>
    </div>
  </main>
`;

fs.writeFileSync('docs/screenshots/snap_p2_list.html', wrapPage('Events Catalog', eventListHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p2_details.html', wrapPage('Event Details', eventDetailsHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p2_register.html', wrapPage('Student Registration', studentRegHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p2_myregs.html', wrapPage('My Registrations', myRegsHtml), 'utf8');

console.log('Program 2 snapshots prepared!');
