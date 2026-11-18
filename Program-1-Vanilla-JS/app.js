/**
 * Program 1: Vanilla JavaScript College Event Registration System
 * Features:
 *  - DOM manipulation
 *  - Fetch API & async/await
 *  - Dynamic event listing
 *  - Event registration form with rigorous input validation
 *  - Sorting and multi-parameter filtering
 *  - Event status updates & real-time seat counters
 *  - JSON request and response handling
 *  - LocalStorage persistence with registration cancellation
 */

// Fallback initial dataset in case user opens index.html directly via file:// where fetch may be CORS-restricted
const DEFAULT_EVENTS = [
  {
    id: 1,
    title: "National Hackathon 2026: CodeCrafters",
    category: "Technical",
    description: "36-hour non-stop hackathon challenging students to build innovative AI, Web3, and IoT solutions for real-world problems.",
    venue: "Campus Innovation Hub & Lab 4",
    event_date: "2026-11-20T09:00:00",
    total_seats: 120,
    available_seats: 24,
    status: "Open",
    speaker: "Dr. Sarah Jenkins (Lead AI Architect, TechCorp)",
    tags: ["Coding", "AI", "Team Event", "Prizes"]
  },
  {
    id: 2,
    title: "Aura 2026: Annual Inter-College Cultural Fest",
    category: "Cultural",
    description: "A vibrant celebration of music, dance, theatrical acts, photography exhibitions, and battle of the college bands.",
    venue: "Main University Auditorium",
    event_date: "2026-11-25T17:00:00",
    total_seats: 500,
    available_seats: 85,
    status: "Open",
    speaker: "Cultural Committee & Celebrity Guests",
    tags: ["Music", "Dance", "Drama", "Art"]
  },
  {
    id: 3,
    title: "Generative AI & LLM Systems Hands-on Workshop",
    category: "Workshop",
    description: "Master prompt engineering, retrieval-augmented generation (RAG), vector embeddings, and LangChain integration.",
    venue: "Computer Center Room 201",
    event_date: "2026-11-22T10:30:00",
    total_seats: 60,
    available_seats: 4,
    status: "Fast Filling",
    speaker: "Prof. Alan Verma (Machine Learning Faculty)",
    tags: ["AI", "Hands-on", "Python", "Certificate"]
  },
  {
    id: 4,
    title: "Inter-Department Cricket & Football Tournament",
    category: "Sports",
    description: "Annual sporting extravaganza featuring T20 cricket clashes, 7-a-side football matches, and track & field heats.",
    venue: "University Sports Ground",
    event_date: "2026-11-28T08:00:00",
    total_seats: 150,
    available_seats: 60,
    status: "Open",
    speaker: "Coach Vikram Rathore (Sports Director)",
    tags: ["Outdoor", "Tournament", "Trophies"]
  },
  {
    id: 5,
    title: "Future of Cloud Computing & DevOps Seminar",
    category: "Seminar",
    description: "Industry keynote on microservices architectures, Kubernetes orchestration, CI/CD pipelines, and cloud security.",
    venue: "Seminar Hall B (Block 3)",
    event_date: "2026-11-30T14:00:00",
    total_seats: 80,
    available_seats: 0,
    status: "Closed",
    speaker: "Rohan Mehra (DevOps Architect, CloudScale)",
    tags: ["DevOps", "Cloud", "Kubernetes", "Career"]
  },
  {
    id: 6,
    title: "CyberShield: Ethical Hacking & Security Bootcamp",
    category: "Workshop",
    description: "Learn penetration testing fundamentals, web application security (OWASP Top 10), and capture-the-flag (CTF) challenges.",
    venue: "Cyber Security Research Lab",
    event_date: "2026-12-05T11:00:00",
    total_seats: 50,
    available_seats: 12,
    status: "Open",
    speaker: "Maya Iyer (Certified Ethical Hacker & Analyst)",
    tags: ["Security", "CTF", "Hands-on"]
  }
];

class CollegeEventManager {
  constructor() {
    this.events = [];
    this.registrations = [];
    this.filters = {
      search: "",
      category: "All",
      status: "All",
      sortBy: "date-asc"
    };

    // DOM Elements cache
    this.dom = {
      eventGrid: document.getElementById("eventGrid"),
      loadingIndicator: document.getElementById("loadingIndicator"),
      emptyState: document.getElementById("emptyState"),
      resultsCount: document.getElementById("resultsCount"),
      activeFilterTags: document.getElementById("activeFilterTags"),
      searchInput: document.getElementById("searchInput"),
      clearSearchBtn: document.getElementById("clearSearchBtn"),
      categoryFilter: document.getElementById("categoryFilter"),
      statusFilter: document.getElementById("statusFilter"),
      sortBy: document.getElementById("sortBy"),
      resetFiltersBtn: document.getElementById("resetFiltersBtn"),
      statTotalEvents: document.getElementById("statTotalEvents"),
      statTotalSeats: document.getElementById("statTotalSeats"),
      statAvailableSeats: document.getElementById("statAvailableSeats"),
      statMyRegistrations: document.getElementById("statMyRegistrations"),
      regCounter: document.getElementById("regCounter"),
      // Modals
      detailsModal: document.getElementById("detailsModal"),
      modalEventTitle: document.getElementById("modalEventTitle"),
      modalEventDetailsBody: document.getElementById("modalEventDetailsBody"),
      modalRegisterCtaBtn: document.getElementById("modalRegisterCtaBtn"),
      registerModal: document.getElementById("registerModal"),
      registrationForm: document.getElementById("registrationForm"),
      regEventSelect: document.getElementById("regEventSelect"),
      selectedEventSeatHint: document.getElementById("selectedEventSeatHint"),
      formAlert: document.getElementById("formAlert"),
      // Drawer
      registrationsDrawer: document.getElementById("registrationsDrawer"),
      drawerList: document.getElementById("drawerList"),
      drawerEmptyNotice: document.getElementById("drawerEmptyNotice"),
      clearAllRegsBtn: document.getElementById("clearAllRegsBtn"),
      toastContainer: document.getElementById("toastContainer")
    };

    this.activeDetailEventId = null;
    this.init();
  }

  async init() {
    this.bindEvents();
    this.loadRegistrationsFromStorage();
    await this.fetchEvents();
    this.populateEventSelect();
    this.applyFiltersAndRender();
    this.updateStats();
  }

  /**
   * Fetch events data asynchronously using Fetch API & async/await.
   * Gracefully falls back to bundled dataset if fetch fails (e.g. file:// protocol restriction).
   */
  async fetchEvents() {
    this.showLoading(true);
    try {
      // Check if previously stored state exists in localStorage
      const cached = localStorage.getItem("cp_events_v1");
      if (cached) {
        this.events = JSON.parse(cached);
      } else {
        const response = await fetch("data.json", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.events = await response.json();
        this.saveEventsToStorage();
      }
    } catch (err) {
      console.warn("Fetch failed, loading default fallback dataset:", err.message);
      this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
      this.saveEventsToStorage();
    } finally {
      this.showLoading(false);
    }
  }

  saveEventsToStorage() {
    try {
      localStorage.setItem("cp_events_v1", JSON.stringify(this.events));
    } catch (e) {
      console.error("Failed to write to localStorage:", e);
    }
  }

  loadRegistrationsFromStorage() {
    try {
      const stored = localStorage.getItem("cp_registrations_v1");
      this.registrations = stored ? JSON.parse(stored) : [];
    } catch (e) {
      this.registrations = [];
    }
  }

  saveRegistrationsToStorage() {
    try {
      localStorage.setItem("cp_registrations_v1", JSON.stringify(this.registrations));
    } catch (e) {
      console.error("Failed to save registrations:", e);
    }
  }

  bindEvents() {
    // Search input
    this.dom.searchInput.addEventListener("input", (e) => {
      this.filters.search = e.target.value.trim().toLowerCase();
      this.dom.clearSearchBtn.style.display = this.filters.search ? "block" : "none";
      this.applyFiltersAndRender();
    });

    this.dom.clearSearchBtn.addEventListener("click", () => {
      this.dom.searchInput.value = "";
      this.filters.search = "";
      this.dom.clearSearchBtn.style.display = "none";
      this.applyFiltersAndRender();
    });

    // Category filter
    this.dom.categoryFilter.addEventListener("change", (e) => {
      this.filters.category = e.target.value;
      this.applyFiltersAndRender();
    });

    // Status filter
    this.dom.statusFilter.addEventListener("change", (e) => {
      this.filters.status = e.target.value;
      this.applyFiltersAndRender();
    });

    // Sort selector
    this.dom.sortBy.addEventListener("change", (e) => {
      this.filters.sortBy = e.target.value;
      this.applyFiltersAndRender();
    });

    // Reset filters
    this.dom.resetFiltersBtn.addEventListener("click", () => {
      this.filters = { search: "", category: "All", status: "All", sortBy: "date-asc" };
      this.dom.searchInput.value = "";
      this.dom.clearSearchBtn.style.display = "none";
      this.dom.categoryFilter.value = "All";
      this.dom.statusFilter.value = "All";
      this.dom.sortBy.value = "date-asc";
      this.applyFiltersAndRender();
      this.showToast("Filters reset to default", "info");
    });

    // Modals open/close
    document.getElementById("openRegisterModalBtn").addEventListener("click", () => {
      this.openRegisterModal();
    });

    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close");
        this.closeModal(modalId);
      });
    });

    // Drawer open/close
    document.getElementById("viewRegistrationsBtn").addEventListener("click", () => {
      this.openDrawer();
    });
    document.getElementById("closeDrawerBtn").addEventListener("click", () => {
      this.closeDrawer();
    });
    document.querySelector("[data-close-drawer]").addEventListener("click", () => {
      this.closeDrawer();
    });

    // Modal register CTA
    this.dom.modalRegisterCtaBtn.addEventListener("click", () => {
      const eventId = this.activeDetailEventId;
      this.closeModal("detailsModal");
      this.openRegisterModal(eventId);
    });

    // Clear all registrations
    this.dom.clearAllRegsBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your local registrations? Seats will be restored.")) {
        this.clearAllRegistrations();
      }
    });

    // Event select change in registration form
    this.dom.regEventSelect.addEventListener("change", (e) => {
      this.updateSelectedEventHint(e.target.value);
    });

    // Registration Form submission
    this.dom.registrationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleRegistrationSubmit();
    });
  }

  showLoading(show) {
    this.dom.loadingIndicator.style.display = show ? "block" : "none";
  }

  updateStats() {
    const totalEvents = this.events.length;
    const totalSeats = this.events.reduce((sum, ev) => sum + Number(ev.total_seats || 0), 0);
    const availableSeats = this.events.reduce((sum, ev) => sum + Number(ev.available_seats || 0), 0);
    const myRegs = this.registrations.length;

    this.dom.statTotalEvents.textContent = totalEvents;
    this.dom.statTotalSeats.textContent = totalSeats;
    this.dom.statAvailableSeats.textContent = availableSeats;
    this.dom.statMyRegistrations.textContent = myRegs;
    this.dom.regCounter.textContent = myRegs;
  }

  populateEventSelect() {
    const select = this.dom.regEventSelect;
    select.innerHTML = '<option value="">-- Choose an Event --</option>';

    this.events.forEach((ev) => {
      const option = document.createElement("option");
      option.value = ev.id;
      const isClosed = ev.available_seats <= 0 || ev.status === "Closed";
      option.textContent = `${ev.title} (${ev.category}) - ${isClosed ? "CLOSED" : ev.available_seats + " seats left"}`;
      if (isClosed) {
        option.disabled = true;
      }
      select.appendChild(option);
    });
  }

  updateSelectedEventHint(eventId) {
    const ev = this.events.find((e) => e.id == eventId);
    if (!ev) {
      this.dom.selectedEventSeatHint.textContent = "";
      return;
    }
    const percentLeft = Math.round((ev.available_seats / ev.total_seats) * 100);
    this.dom.selectedEventSeatHint.textContent = `Venue: ${ev.venue} | ${ev.available_seats} of ${ev.total_seats} seats remaining (${percentLeft}% open)`;
  }

  applyFiltersAndRender() {
    let filtered = [...this.events];

    // Search filter
    if (this.filters.search) {
      const q = this.filters.search;
      filtered = filtered.filter((ev) => {
        const inTitle = ev.title.toLowerCase().includes(q);
        const inDesc = ev.description.toLowerCase().includes(q);
        const inVenue = ev.venue.toLowerCase().includes(q);
        const inSpeaker = ev.speaker ? ev.speaker.toLowerCase().includes(q) : false;
        const inTags = ev.tags ? ev.tags.some((t) => t.toLowerCase().includes(q)) : false;
        return inTitle || inDesc || inVenue || inSpeaker || inTags;
      });
    }

    // Category filter
    if (this.filters.category !== "All") {
      filtered = filtered.filter((ev) => ev.category === this.filters.category);
    }

    // Status filter
    if (this.filters.status !== "All") {
      filtered = filtered.filter((ev) => ev.status === this.filters.status);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (this.filters.sortBy) {
        case "date-asc":
          return new Date(a.event_date) - new Date(b.event_date);
        case "date-desc":
          return new Date(b.event_date) - new Date(a.event_date);
        case "seats-desc":
          return b.available_seats - a.available_seats;
        case "seats-asc":
          return a.available_seats - b.available_seats;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    this.renderEvents(filtered);
    this.renderActiveFilterTags();
  }

  renderActiveFilterTags() {
    const container = this.dom.activeFilterTags;
    container.innerHTML = "";

    if (this.filters.search) {
      container.appendChild(this.createTag(`Search: "${this.filters.search}"`));
    }
    if (this.filters.category !== "All") {
      container.appendChild(this.createTag(`Category: ${this.filters.category}`));
    }
    if (this.filters.status !== "All") {
      container.appendChild(this.createTag(`Status: ${this.filters.status}`));
    }
  }

  createTag(text) {
    const span = document.createElement("span");
    span.className = "filter-tag";
    span.textContent = text;
    return span;
  }

  renderEvents(eventsToRender) {
    const grid = this.dom.eventGrid;
    grid.innerHTML = "";

    this.dom.resultsCount.textContent = `Showing ${eventsToRender.length} of ${this.events.length} events`;

    if (eventsToRender.length === 0) {
      this.dom.emptyState.style.display = "block";
      return;
    } else {
      this.dom.emptyState.style.display = "none";
    }

    eventsToRender.forEach((ev) => {
      const card = document.createElement("article");
      card.className = "event-card";
      card.dataset.id = ev.id;

      // Status helper
      let statusClass = `status-${ev.status.replace(/\s+/g, "-")}`;
      let catClass = `category-${ev.category}`;

      // Date formatting
      const eventDate = new Date(ev.event_date);
      const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      const formattedTime = eventDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });

      // Seat percentage
      const total = Number(ev.total_seats) || 1;
      const avail = Number(ev.available_seats);
      const filledPercent = Math.min(100, Math.max(0, Math.round(((total - avail) / total) * 100)));

      let progressColor = "green";
      if (avail === 0) progressColor = "red";
      else if (avail <= 15) progressColor = "amber";

      const isRegistered = this.registrations.some((r) => r.eventId == ev.id);
      const isFull = avail <= 0 || ev.status === "Closed";

      card.innerHTML = `
        <div class="card-header">
          <span class="category-badge ${catClass}">${ev.category}</span>
          <span class="status-badge ${statusClass}">${ev.status}</span>
        </div>

        <h3 class="event-title">${this.escapeHTML(ev.title)}</h3>
        <p class="event-desc">${this.escapeHTML(ev.description)}</p>

        <div class="event-meta">
          <div class="meta-row">
            <span class="meta-icon">📅</span>
            <span>${formattedDate} &bull; ${formattedTime}</span>
          </div>
          <div class="meta-row">
            <span class="meta-icon">📍</span>
            <span>${this.escapeHTML(ev.venue)}</span>
          </div>
          ${ev.speaker ? `
          <div class="meta-row">
            <span class="meta-icon">🎙️</span>
            <span>${this.escapeHTML(ev.speaker)}</span>
          </div>` : ""}
        </div>

        <div class="seat-progress-box">
          <div class="seat-progress-label">
            <span>Availability: ${avail} / ${total} seats</span>
            <span>${filledPercent}% filled</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${progressColor}" style="width: ${filledPercent}%"></div>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn-secondary view-details-btn" data-id="${ev.id}">
            View Details
          </button>
          <button class="btn btn-primary register-btn" data-id="${ev.id}" ${isFull || isRegistered ? "disabled" : ""}>
            ${isRegistered ? "✓ Registered" : isFull ? "Sold Out" : "Register"}
          </button>
        </div>
      `;

      // Event listeners for card buttons
      card.querySelector(".view-details-btn").addEventListener("click", () => {
        this.openDetailsModal(ev.id);
      });

      card.querySelector(".register-btn").addEventListener("click", () => {
        if (!isFull && !isRegistered) {
          this.openRegisterModal(ev.id);
        }
      });

      grid.appendChild(card);
    });
  }

  openDetailsModal(eventId) {
    const ev = this.events.find((e) => e.id == eventId);
    if (!ev) return;

    this.activeDetailEventId = ev.id;
    this.dom.modalEventTitle.textContent = ev.title;

    const eventDate = new Date(ev.event_date).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short"
    });

    const isRegistered = this.registrations.some((r) => r.eventId == ev.id);
    const isFull = ev.available_seats <= 0 || ev.status === "Closed";

    this.dom.modalEventDetailsBody.innerHTML = `
      <div class="detail-banner">
        <span class="category-badge category-${ev.category}">${ev.category}</span>
        <h4 style="margin: 0.5rem 0; font-size: 1.15rem;">${this.escapeHTML(ev.title)}</h4>
        <p style="color: var(--secondary); font-size: 0.875rem;">${this.escapeHTML(ev.description)}</p>
      </div>

      <div class="event-meta" style="border: none; padding: 0;">
        <div class="meta-row"><strong>Date & Time:</strong> ${eventDate}</div>
        <div class="meta-row"><strong>Venue:</strong> ${this.escapeHTML(ev.venue)}</div>
        <div class="meta-row"><strong>Keynote / Host:</strong> ${this.escapeHTML(ev.speaker || "College Faculty")}</div>
        <div class="meta-row"><strong>Capacity:</strong> ${ev.total_seats} Total (${ev.available_seats} currently free)</div>
        <div class="meta-row"><strong>Current Status:</strong> <span class="status-badge status-${ev.status.replace(/\s+/g, "-")}">${ev.status}</span></div>
      </div>

      ${ev.tags && ev.tags.length ? `
        <div class="detail-tags">
          ${ev.tags.map((t) => `<span class="detail-tag">#${this.escapeHTML(t)}</span>`).join("")}
        </div>
      ` : ""}
    `;

    if (isRegistered) {
      this.dom.modalRegisterCtaBtn.textContent = "Already Registered";
      this.dom.modalRegisterCtaBtn.disabled = true;
    } else if (isFull) {
      this.dom.modalRegisterCtaBtn.textContent = "Registration Closed";
      this.dom.modalRegisterCtaBtn.disabled = true;
    } else {
      this.dom.modalRegisterCtaBtn.textContent = "Proceed to Register";
      this.dom.modalRegisterCtaBtn.disabled = false;
    }

    this.openModal("detailsModal");
  }

  openRegisterModal(preselectedEventId = null) {
    this.resetFormValidation();
    this.dom.registrationForm.reset();
    this.dom.formAlert.style.display = "none";

    if (preselectedEventId) {
      this.dom.regEventSelect.value = preselectedEventId;
      this.updateSelectedEventHint(preselectedEventId);
    } else {
      this.dom.regEventSelect.value = "";
      this.dom.selectedEventSeatHint.textContent = "";
    }

    this.openModal("registerModal");
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  openDrawer() {
    this.renderDrawerRegistrations();
    this.dom.registrationsDrawer.classList.add("show");
    this.dom.registrationsDrawer.setAttribute("aria-hidden", "false");
  }

  closeDrawer() {
    this.dom.registrationsDrawer.classList.remove("show");
    this.dom.registrationsDrawer.setAttribute("aria-hidden", "true");
  }

  renderDrawerRegistrations() {
    const list = this.dom.drawerList;
    list.innerHTML = "";

    if (this.registrations.length === 0) {
      this.dom.drawerEmptyNotice.style.display = "block";
      return;
    }
    this.dom.drawerEmptyNotice.style.display = "none";

    this.registrations.forEach((reg) => {
      const ev = this.events.find((e) => e.id == reg.eventId) || {
        title: reg.eventTitle || "Registered Event",
        venue: "Main Campus"
      };

      const item = document.createElement("div");
      item.className = "reg-item";
      item.innerHTML = `
        <div class="reg-item-title">${this.escapeHTML(ev.title)}</div>
        <div class="reg-item-meta">
          Registration ID: #REG-${reg.id} &bull; ${new Date(reg.timestamp).toLocaleDateString()}
        </div>
        <div class="reg-item-student">
          <strong>${this.escapeHTML(reg.studentName)}</strong> (${this.escapeHTML(reg.studentRoll)})<br>
          <span style="color: var(--text-muted); font-size: 0.75rem;">${this.escapeHTML(reg.studentDept)} &bull; ${reg.studentEmail}</span>
        </div>
        <button class="btn btn-danger btn-sm cancel-reg-btn" style="width: 100%; font-size: 0.75rem; padding: 0.4rem;" data-reg-id="${reg.id}" data-event-id="${reg.eventId}">
          Cancel Registration
        </button>
      `;

      item.querySelector(".cancel-reg-btn").addEventListener("click", () => {
        this.cancelRegistration(reg.id, reg.eventId);
      });

      list.appendChild(item);
    });
  }

  /**
   * Cancel an existing registration: restores available seat count and saves state.
   */
  cancelRegistration(regId, eventId) {
    if (!confirm("Are you sure you want to cancel this registration? Your seat will be returned.")) {
      return;
    }

    this.registrations = this.registrations.filter((r) => r.id != regId);
    this.saveRegistrationsToStorage();

    // Increment available seat back
    const ev = this.events.find((e) => e.id == eventId);
    if (ev) {
      ev.available_seats = Math.min(ev.total_seats, ev.available_seats + 1);
      if (ev.available_seats > 15) {
        ev.status = "Open";
      } else if (ev.available_seats > 0) {
        ev.status = "Fast Filling";
      }
      this.saveEventsToStorage();
    }

    this.populateEventSelect();
    this.applyFiltersAndRender();
    this.updateStats();
    this.renderDrawerRegistrations();
    this.showToast("Registration cancelled successfully. Seat restored.", "warning");
  }

  clearAllRegistrations() {
    // Restore seats for all cancelled items
    this.registrations.forEach((reg) => {
      const ev = this.events.find((e) => e.id == reg.eventId);
      if (ev) {
        ev.available_seats = Math.min(ev.total_seats, ev.available_seats + 1);
        if (ev.available_seats > 15) ev.status = "Open";
        else if (ev.available_seats > 0) ev.status = "Fast Filling";
      }
    });

    this.registrations = [];
    this.saveRegistrationsToStorage();
    this.saveEventsToStorage();
    this.populateEventSelect();
    this.applyFiltersAndRender();
    this.updateStats();
    this.renderDrawerRegistrations();
    this.showToast("All local registration records cleared", "info");
  }

  /**
   * Comprehensive Form Input Validation
   */
  validateForm(formData) {
    let isValid = true;
    this.resetFormValidation();

    const { eventId, studentName, studentRoll, studentEmail, studentPhone, studentDept, studentSemester, termsAgreement } = formData;

    // Event validation
    if (!eventId) {
      this.setFieldError("regEventSelect", "Please select an event.");
      isValid = false;
    } else {
      const ev = this.events.find((e) => e.id == eventId);
      if (!ev || ev.available_seats <= 0 || ev.status === "Closed") {
        this.setFieldError("regEventSelect", "Selected event has no available seats.");
        isValid = false;
      }
    }

    // Name validation (letters and spaces only, 3-50 chars)
    const nameRegex = /^[A-Za-z\s.]{3,50}$/;
    if (!studentName || !nameRegex.test(studentName.trim())) {
      this.setFieldError("studentName", "Name must be 3-50 characters containing letters only.");
      isValid = false;
    }

    // Roll number validation (alphanumeric, min 4 chars)
    const rollRegex = /^[A-Za-z0-9\-_]{4,20}$/;
    if (!studentRoll || !rollRegex.test(studentRoll.trim())) {
      this.setFieldError("studentRoll", "Roll Number must be 4-20 alphanumeric characters.");
      isValid = false;
    }

    // College Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!studentEmail || !emailRegex.test(studentEmail.trim())) {
      this.setFieldError("studentEmail", "Please provide a valid college email address.");
      isValid = false;
    }

    // Mobile Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!studentPhone || !phoneRegex.test(studentPhone.trim())) {
      this.setFieldError("studentPhone", "Please enter a valid 10-digit mobile number.");
      isValid = false;
    }

    // Department
    if (!studentDept) {
      this.setFieldError("studentDept", "Please choose your department.");
      isValid = false;
    }

    // Semester
    if (!studentSemester) {
      this.setFieldError("studentSemester", "Please select your semester.");
      isValid = false;
    }

    // Terms checkbox
    if (!termsAgreement) {
      this.setFieldError("termsAgreement", "You must agree to college event guidelines.");
      isValid = false;
    }

    // Duplicate registration check (same email + same event)
    if (isValid && eventId && studentEmail) {
      const alreadyRegistered = this.registrations.some(
        (r) => r.eventId == eventId && r.studentEmail.toLowerCase() === studentEmail.trim().toLowerCase()
      );
      if (alreadyRegistered) {
        this.showFormAlert("Duplicate Registration: You have already registered for this event with this email.", "error");
        isValid = false;
      }
    }

    return isValid;
  }

  setFieldError(fieldId, errorMsg) {
    const field = document.getElementById(fieldId);
    if (field) field.classList.add("invalid");
    const errBox = document.getElementById(`err-${fieldId}`);
    if (errBox) errBox.textContent = errorMsg;
  }

  resetFormValidation() {
    document.querySelectorAll(".error-msg").forEach((el) => (el.textContent = ""));
    document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
    this.dom.formAlert.style.display = "none";
  }

  showFormAlert(message, type = "error") {
    const alertBox = this.dom.formAlert;
    alertBox.textContent = message;
    alertBox.className = `form-alert alert-${type}`;
    alertBox.style.display = "block";
  }

  /**
   * Handle form submission, simulate API request, decrement seats, update statuses
   */
  async handleRegistrationSubmit() {
    const form = this.dom.registrationForm;
    const submitBtn = document.getElementById("submitRegBtn");

    const payload = {
      eventId: form.eventId.value,
      studentName: form.studentName.value.trim(),
      studentRoll: form.studentRoll.value.trim().toUpperCase(),
      studentEmail: form.studentEmail.value.trim().toLowerCase(),
      studentPhone: form.studentPhone.value.trim(),
      studentDept: form.studentDept.value,
      studentSemester: form.studentSemester.value,
      termsAgreement: form.termsAgreement.checked
    };

    if (!this.validateForm(payload)) {
      return;
    }

    // Simulate async network request
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing Registration...";

    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const eventObj = this.events.find((e) => e.id == payload.eventId);
      if (!eventObj || eventObj.available_seats <= 0) {
        throw new Error("Event has reached maximum capacity just now!");
      }

      // Decrement seats
      eventObj.available_seats -= 1;
      if (eventObj.available_seats === 0) {
        eventObj.status = "Closed";
      } else if (eventObj.available_seats <= 15) {
        eventObj.status = "Fast Filling";
      }

      const registrationRecord = {
        id: Date.now(),
        eventId: Number(payload.eventId),
        eventTitle: eventObj.title,
        studentName: payload.studentName,
        studentRoll: payload.studentRoll,
        studentEmail: payload.studentEmail,
        studentPhone: payload.studentPhone,
        studentDept: payload.studentDept,
        studentSemester: payload.studentSemester,
        timestamp: new Date().toISOString()
      };

      this.registrations.unshift(registrationRecord);
      this.saveRegistrationsToStorage();
      this.saveEventsToStorage();

      this.showToast(`Success! Registered for "${eventObj.title}"`, "success");
      this.closeModal("registerModal");

      // Update UI
      this.populateEventSelect();
      this.applyFiltersAndRender();
      this.updateStats();
    } catch (err) {
      this.showFormAlert(err.message, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Confirm Registration";
    }
  }

  showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-body">${this.escapeHTML(message)}</div>
      <button class="toast-close">&times;</button>
    `;

    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.remove();
    });

    this.dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 4500);
  }

  escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  window.eventManager = new CollegeEventManager();
});
