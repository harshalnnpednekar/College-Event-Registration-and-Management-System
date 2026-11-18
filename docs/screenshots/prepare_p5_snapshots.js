const fs = require('fs');

const css = fs.readFileSync('Program-5-Full-Stack/frontend/src/index.css', 'utf8');

function wrapFullStackPage(title, activeRole, contentHtml) {
  const isAdmin = activeRole === 'admin';
  const user = isAdmin ? {
    name: 'Administrator',
    role: 'admin',
    email: 'admin@college.edu'
  } : {
    name: 'Alex Rivera (Roll No: 41)',
    role: 'student',
    email: 'alex.rivera@college.edu'
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} | Program 5 Integrated Full-Stack</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    ${css}
  </style>
</head>
<body>
  <div class="app-shell">
    <header class="navbar">
      <div class="nav-container">
        <div class="brand">
          <div class="brand-icon">🎓</div>
          <div class="brand-text">
            <span class="brand-title">CampusPulse Integrated</span>
            <span class="brand-badge">Program 5 &bull; React + Express + PostgreSQL (CO6)</span>
          </div>
        </div>

        <nav class="nav-links">
          <a href="#" class="nav-link ${!isAdmin ? 'active' : ''}">Events</a>
          ${!isAdmin ? `<a href="#" class="nav-link">My Registrations</a>` : ''}
          ${isAdmin ? `
            <a href="#" class="nav-link ${title.includes('Dashboard') ? 'active' : ''}">📊 Dashboard</a>
            <a href="#" class="nav-link ${title.includes('Manage') ? 'active' : ''}">📅 Manage Events</a>
            <a href="#" class="nav-link ${title.includes('Audit') ? 'active' : ''}">👥 Registrations</a>
          ` : ''}

          <div class="nav-auth-section">
            <div class="user-profile-badge">
              <div class="user-avatar">${user.name.charAt(0)}</div>
              <div class="user-info-text">
                <span class="user-name">${user.name}</span>
                <span class="user-role-pill role-${user.role}">${user.role}</span>
              </div>
              <button class="btn btn-secondary btn-sm" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">Logout</button>
            </div>
          </div>
        </nav>
      </div>
    </header>

    ${contentHtml}

    <footer class="footer">
      <div class="container footer-content">
        <p><strong>CampusPulse Integrated Full-Stack</strong> &bull; College Event Registration and Management System</p>
        <p class="footer-sub">Program 5: React.js + Express.js + PostgreSQL (ACID Transactions) &bull; Vercel &amp; Render Cloud Deployment &bull; Roll No: 41</p>
      </div>
    </footer>
  </div>
</body>
</html>`;
}

// 1. Snapshot: Full-Stack Student Portal (Home)
const studentHomeHtml = `
  <section class="hero-section">
    <div class="container hero-content">
      <div class="hero-badge">Full-Stack Enterprise &bull; PostgreSQL Concurrency Safe</div>
      <h1 class="hero-title">College Event Registration &amp; Management Portal</h1>
      <p class="hero-subtitle">
        Explore symposiums, hackathons, and workshops. Real-time seat allocation powered by PostgreSQL database transactions with instant seat safety.
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
    <section class="filter-panel">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search by event title, venue, or keywords..." value="">
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
      <span>Displaying 6 live campus events from PostgreSQL</span>
    </div>

    <div class="event-grid">
      <article class="event-card">
        <div class="card-header">
          <span class="category-badge category-Technical">Technical</span>
          <span class="status-badge status-Open">Open</span>
        </div>
        <h3 class="event-title">National Hackathon 2026: CodeCrafters</h3>
        <p class="event-desc">36-hour non-stop hackathon challenging students to build innovative AI, Web3, and IoT solutions for real-world problems.</p>
        <div class="event-meta">
          <div class="meta-row"><span class="meta-icon">📅</span><span>Fri, Nov 20, 2026 &bull; 09:00 AM</span></div>
          <div class="meta-row"><span class="meta-icon">📍</span><span>Campus Innovation Hub &amp; Lab 4</span></div>
        </div>
        <div class="seat-progress-box">
          <div class="seat-progress-label"><span>24 / 120 seats available</span><span>80% filled</span></div>
          <div class="progress-track"><div class="progress-fill green" style="width: 80%"></div></div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary">Details</button>
          <button class="btn btn-primary" style="background: #16a34a; pointer-events: none;">&#10004; Registered</button>
        </div>
      </article>

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
        </div>
        <div class="seat-progress-box">
          <div class="seat-progress-label"><span>85 / 500 seats available</span><span>83% filled</span></div>
          <div class="progress-track"><div class="progress-fill green" style="width: 83%"></div></div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary">Details</button>
          <button class="btn btn-primary">Register</button>
        </div>
      </article>

      <article class="event-card">
        <div class="card-header">
          <span class="category-badge category-Workshop">Workshop</span>
          <span class="status-badge status-Fast-Filling">Fast Filling</span>
        </div>
        <h3 class="event-title">Generative AI &amp; LLM Systems Hands-on Workshop</h3>
        <p class="event-desc">Master prompt engineering, retrieval-augmented generation (RAG), vector embeddings, and LangChain integration.</p>
        <div class="event-meta">
          <div class="meta-row"><span class="meta-icon">📅</span><span>Sun, Nov 22, 2026 &bull; 10:30 AM</span></div>
          <div class="meta-row"><span class="meta-icon">📍</span><span>Computer Center Room 201</span></div>
        </div>
        <div class="seat-progress-box">
          <div class="seat-progress-label"><span>4 / 60 seats available</span><span>93% filled</span></div>
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

// 2. Snapshot: Login Page with Quick-Fill Demo Accounts
const loginHtml = `
  <main class="container main-content">
    <div class="form-card-container">
      <div class="form-header">
        <h1 class="form-title">Account Login</h1>
        <p class="form-subtitle">Enter your college credentials to access your event dashboard.</p>
      </div>

      <div class="quick-fill-box">
        <span class="quick-fill-title">Quick Demo Logins (Instant Testing):</span>
        <div class="quick-fill-btns">
          <button type="button" class="btn btn-outline btn-sm">👑 Fill Admin (admin@college.edu)</button>
          <button type="button" class="btn btn-outline btn-sm" style="background: var(--primary-light);">🎓 Fill Student: Roll No 41 (alex.rivera@college.edu)</button>
        </div>
      </div>

      <form>
        <div class="form-group">
          <label>College Email Address <span class="required">*</span></label>
          <input type="email" value="alex.rivera@college.edu" readonly>
        </div>
        <div class="form-group">
          <label>Password <span class="required">*</span></label>
          <input type="password" value="Student@123" readonly>
        </div>
        <button type="button" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Sign In</button>
      </form>
      <div class="form-footer-note">Don't have an account yet? <a href="#">Register here as a student</a></div>
    </div>
  </main>
`;

// 3. Snapshot: Administrator Analytics Dashboard
const adminDashHtml = `
  <main class="container main-content">
    <div class="admin-header">
      <div>
        <span class="hero-badge">Admin Control Panel</span>
        <h1 class="details-title">College Events &amp; Analytics Dashboard</h1>
      </div>
      <div class="admin-header-actions">
        <button class="btn btn-primary">+ Create New Event</button>
        <button class="btn btn-secondary">View All Registrations</button>
      </div>
    </div>

    <div class="stats-ribbon" style="margin-top: 1.5rem; margin-bottom: 2rem;">
      <div class="stat-card" style="background: #1e293b;"><div class="stat-num">6</div><div class="stat-label">Total Events</div></div>
      <div class="stat-card" style="background: #1e293b;"><div class="stat-num">4</div><div class="stat-label">Total Registrations</div></div>
      <div class="stat-card" style="background: #1e293b;"><div class="stat-num">3</div><div class="stat-label">Registered Students</div></div>
      <div class="stat-card" style="background: #1e293b;"><div class="stat-num">81%</div><div class="stat-label">Seat Utilization</div></div>
    </div>

    <div class="admin-grid">
      <div class="card-box">
        <h3 class="section-title">📊 Campus Capacity Overview</h3>
        <div class="capacity-stat-rows">
          <div class="cap-row"><span>Total Sanctioned Seats:</span><strong>960 seats</strong></div>
          <div class="cap-row"><span>Confirmed Registrations:</span><strong style="color: var(--success)">775 seats</strong></div>
          <div class="cap-row"><span>Unoccupied Available Seats:</span><strong style="color: var(--primary)">185 seats</strong></div>
        </div>
        <div class="progress-track" style="height: 10px; margin-top: 1.25rem;">
          <div class="progress-fill green" style="width: 81%"></div>
        </div>
      </div>

      <div class="card-box">
        <h3 class="section-title">🏷️ Events by Category</h3>
        <div class="category-stat-list">
          <div class="cat-stat-item"><span class="category-badge category-Technical">Technical</span><strong>2 Events</strong></div>
          <div class="cat-stat-item"><span class="category-badge category-Workshop">Workshop</span><strong>2 Events</strong></div>
          <div class="cat-stat-item"><span class="category-badge category-Cultural">Cultural</span><strong>1 Event</strong></div>
          <div class="cat-stat-item"><span class="category-badge category-Sports">Sports</span><strong>1 Event</strong></div>
        </div>
      </div>
    </div>
  </main>
`;

// 4. Snapshot: Administrator Event Management Table
const adminEventsHtml = `
  <main class="container main-content">
    <div class="admin-header">
      <div>
        <h1 class="details-title">Campus Event Management</h1>
        <p class="details-lead">Create, update, monitor capacity, or remove college events.</p>
      </div>
      <button class="btn btn-primary">+ Add New Event</button>
    </div>

    <div class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title &amp; Category</th>
            <th>Venue</th>
            <th>Event Date</th>
            <th>Seats (Avail/Total)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>#1</strong></td>
            <td><div style="font-weight: 600;">National Hackathon 2026: CodeCrafters</div><span class="category-badge category-Technical">Technical</span></td>
            <td>Campus Innovation Hub &amp; Lab 4</td>
            <td>20/11/2026</td>
            <td><strong>24</strong> / 120</td>
            <td><span class="status-badge status-Open">Open</span></td>
            <td><button class="btn btn-secondary btn-sm">Edit</button> <button class="btn btn-danger btn-sm">Delete</button></td>
          </tr>
          <tr>
            <td><strong>#2</strong></td>
            <td><div style="font-weight: 600;">Aura 2026: Annual Cultural Fest</div><span class="category-badge category-Cultural">Cultural</span></td>
            <td>Main University Auditorium</td>
            <td>25/11/2026</td>
            <td><strong>85</strong> / 500</td>
            <td><span class="status-badge status-Open">Open</span></td>
            <td><button class="btn btn-secondary btn-sm">Edit</button> <button class="btn btn-danger btn-sm">Delete</button></td>
          </tr>
          <tr>
            <td><strong>#3</strong></td>
            <td><div style="font-weight: 600;">Generative AI &amp; LLM Systems Workshop</div><span class="category-badge category-Workshop">Workshop</span></td>
            <td>Computer Center Room 201</td>
            <td>22/11/2026</td>
            <td><strong>4</strong> / 60</td>
            <td><span class="status-badge status-Fast-Filling">Fast Filling</span></td>
            <td><button class="btn btn-secondary btn-sm">Edit</button> <button class="btn btn-danger btn-sm">Delete</button></td>
          </tr>
          <tr>
            <td><strong>#4</strong></td>
            <td><div style="font-weight: 600;">Cloud Architecture &amp; DevOps Seminar</div><span class="category-badge category-Seminar">Seminar</span></td>
            <td>Seminar Hall B (Block 3)</td>
            <td>30/11/2026</td>
            <td><strong>0</strong> / 80</td>
            <td><span class="status-badge status-Closed">Closed</span></td>
            <td><button class="btn btn-secondary btn-sm">Edit</button> <button class="btn btn-danger btn-sm">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
`;

// 5. Snapshot: Administrator Master Registrations Table
const adminRegsHtml = `
  <main class="container main-content">
    <div class="admin-header">
      <div>
        <h1 class="details-title">All Student Registrations (Audit Log)</h1>
        <p class="details-lead">Comprehensive audit of student bookings across all college events.</p>
      </div>
      <button class="btn btn-secondary">🖨️ Export / Print Table</button>
    </div>

    <div class="admin-table-container" style="margin-top: 1.5rem;">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Reg ID</th>
            <th>Student Name</th>
            <th>College Email</th>
            <th>Event Booked</th>
            <th>Category</th>
            <th>Registration Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>#101</strong></td>
            <td><strong>Alex Rivera (Roll No: 41)</strong></td>
            <td>alex.rivera@college.edu</td>
            <td>National Hackathon 2026: CodeCrafters</td>
            <td><span class="category-badge category-Technical">Technical</span></td>
            <td>15/11/2026, 04:20:00 PM</td>
            <td><span class="status-badge status-Open">Confirmed</span></td>
          </tr>
          <tr>
            <td><strong>#102</strong></td>
            <td><strong>John Doe</strong></td>
            <td>john.doe@college.edu</td>
            <td>National Hackathon 2026: CodeCrafters</td>
            <td><span class="category-badge category-Technical">Technical</span></td>
            <td>14/11/2026, 02:15:30 PM</td>
            <td><span class="status-badge status-Open">Confirmed</span></td>
          </tr>
          <tr>
            <td><strong>#103</strong></td>
            <td><strong>Jane Smith</strong></td>
            <td>jane.smith@college.edu</td>
            <td>Aura 2026: Annual Cultural Fest</td>
            <td><span class="category-badge category-Cultural">Cultural</span></td>
            <td>14/11/2026, 05:40:12 PM</td>
            <td><span class="status-badge status-Open">Confirmed</span></td>
          </tr>
          <tr>
            <td><strong>#104</strong></td>
            <td><strong>John Doe</strong></td>
            <td>john.doe@college.edu</td>
            <td>Generative AI &amp; LLM Systems Workshop</td>
            <td><span class="category-badge category-Workshop">Workshop</span></td>
            <td>15/11/2026, 09:10:05 AM</td>
            <td><span class="status-badge status-Open">Confirmed</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
`;

fs.writeFileSync('docs/screenshots/snap_p5_home.html', wrapFullStackPage('Events Portal', 'student', studentHomeHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p5_login.html', wrapFullStackPage('Login', 'guest', loginHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p5_dash.html', wrapFullStackPage('Admin Dashboard', 'admin', adminDashHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p5_events.html', wrapFullStackPage('Manage Events', 'admin', adminEventsHtml), 'utf8');
fs.writeFileSync('docs/screenshots/snap_p5_regs.html', wrapFullStackPage('All Registrations Audit', 'admin', adminRegsHtml), 'utf8');

console.log('Program 5 snapshots prepared successfully!');
