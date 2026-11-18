const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const p1Html = fs.readFileSync('Program-1-Vanilla-JS/index.html', 'utf8');

// 1. Snapshot: Program 1 Main View
// Ensure events are rendered directly in the static snapshot for headless screenshot
const eventsData = JSON.parse(fs.readFileSync('Program-1-Vanilla-JS/data.json', 'utf8'));

function generateCardsHtml(events) {
  return events.map(ev => {
    const total = ev.total_seats || 1;
    const avail = ev.available_seats;
    const filledPercent = Math.min(100, Math.max(0, Math.round(((total - avail) / total) * 100)));
    let progressColor = 'green';
    if (avail === 0) progressColor = 'red';
    else if (avail <= 15) progressColor = 'amber';
    const isClosed = avail <= 0 || ev.status === 'Closed';

    return `
      <article class="event-card">
        <div class="card-header">
          <span class="category-badge category-${ev.category}">${ev.category}</span>
          <span class="status-badge status-${ev.status.replace(/\s+/g, '-')}">${ev.status}</span>
        </div>
        <h3 class="event-title">${ev.title}</h3>
        <p class="event-desc">${ev.description}</p>
        <div class="event-meta">
          <div class="meta-row"><span class="meta-icon">📅</span><span>${new Date(ev.event_date).toLocaleDateString()}</span></div>
          <div class="meta-row"><span class="meta-icon">📍</span><span>${ev.venue}</span></div>
          <div class="meta-row"><span class="meta-icon">🎙️</span><span>${ev.speaker || 'College Faculty'}</span></div>
        </div>
        <div class="seat-progress-box">
          <div class="seat-progress-label">
            <span>Availability: ${avail} / ${total} seats</span>
            <span>${filledPercent}% filled</span>
          </div>
          <div class="progress-track"><div class="progress-fill ${progressColor}" style="width: ${filledPercent}%"></div></div>
        </div>
        <div class="card-actions">
          <button class="btn btn-secondary">View Details</button>
          <button class="btn btn-primary" ${isClosed ? 'disabled' : ''}>${isClosed ? 'Sold Out' : 'Register'}</button>
        </div>
      </article>
    `;
  }).join('\n');
}

// Write P1 Portal Main View
let snap1 = p1Html.replace(
  '<section id="eventGrid" class="event-grid">\n      <!-- Dynamically injected via app.js -->\n    </section>',
  `<section id="eventGrid" class="event-grid">${generateCardsHtml(eventsData)}</section>`
);
snap1 = snap1.replace('id="statTotalEvents">0<', 'id="statTotalEvents">6<');
snap1 = snap1.replace('id="statTotalSeats">0<', 'id="statTotalSeats">960<');
snap1 = snap1.replace('id="statAvailableSeats">0<', 'id="statAvailableSeats">185<');
snap1 = snap1.replace('id="statMyRegistrations">0<', 'id="statMyRegistrations">1<');
snap1 = snap1.replace('id="regCounter">0<', 'id="regCounter">1<');
snap1 = snap1.replace('id="resultsCount">Showing 0 events<', 'id="resultsCount">Showing 6 of 6 events<');
// Fix styles path
snap1 = snap1.replace('href="styles.css"', 'href="../../Program-1-Vanilla-JS/styles.css"');
fs.writeFileSync('docs/screenshots/snap_p1_main.html', snap1, 'utf8');

// Write P1 Registration Modal View
let snap2 = snap1.replace(
  '<div id="registerModal" class="modal-backdrop" aria-hidden="true">',
  '<div id="registerModal" class="modal-backdrop show" aria-hidden="false">'
);
// Fill in sample student data in the modal
snap2 = snap2.replace(
  'placeholder="e.g. John Doe"',
  'value="Alex Rivera (Roll No: 41)"'
);
snap2 = snap2.replace(
  'placeholder="e.g. CS2026-042"',
  'value="AI2026-041"'
);
snap2 = snap2.replace(
  'placeholder="e.g. john@college.edu"',
  'value="alex.rivera@college.edu"'
);
snap2 = snap2.replace(
  'placeholder="10-digit mobile"',
  'value="9876543210"'
);
fs.writeFileSync('docs/screenshots/snap_p1_modal.html', snap2, 'utf8');

// Write P1 Drawer View
let snap3 = snap1.replace(
  '<div id="registrationsDrawer" class="drawer-backdrop" aria-hidden="true">',
  '<div id="registrationsDrawer" class="drawer-backdrop show" aria-hidden="false">'
);
snap3 = snap3.replace(
  '<div id="drawerList" class="drawer-list"></div>',
  `<div id="drawerList" class="drawer-list">
    <div class="reg-item">
      <div class="reg-item-title">National Hackathon 2026: CodeCrafters</div>
      <div class="reg-item-meta">Registration ID: #REG-17947388 &bull; Status: Confirmed</div>
      <div class="reg-item-student">
        <strong>Alex Rivera (Roll No: 41)</strong> (AI2026-041)<br>
        <span style="color: var(--text-muted); font-size: 0.75rem;">Artificial Intelligence and Data Science &bull; alex.rivera@college.edu</span>
      </div>
      <button class="btn btn-danger btn-sm" style="width: 100%; font-size: 0.75rem; padding: 0.4rem;">Cancel Registration</button>
    </div>
  </div>`
);
fs.writeFileSync('docs/screenshots/snap_p1_drawer.html', snap3, 'utf8');

console.log('Snapshots prepared successfully!');
