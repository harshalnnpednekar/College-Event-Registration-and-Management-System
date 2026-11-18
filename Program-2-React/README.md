# Program 2: College Event Registration Application (React.js)

**Course Outcome Alignment:** CO3

## Overview
A modern single-page application (SPA) built with React.js, React Router, and component-driven architecture. Demonstrates state lifting, hooks (`useState`, `useEffect`, `useMemo`), route parameters (`useParams`, `useNavigate`), responsive UI cards, and mock data synchronization via localStorage.

## Features Implemented
- **Reusable Functional Components:** `Navbar`, `EventCard`, `FilterBar`, `Toast`, and comprehensive page views.
- **Props and State Management:** Centralized events & registration states in `App.jsx`, synchronized with browser `localStorage`.
- **React Router Navigation:**
  - `/`: Event listing page with live stats and multi-criteria filters
  - `/events/:id`: Event details page displaying agenda, speaker, capacity, and tags
  - `/register` & `/register/:id`: Student event registration form with client validation
  - `/my-registrations`: Active bookings list with ticket generation and registration cancellation
- **Conditional Rendering:** Dynamically renders badges, seat progress bars, sold-out alerts, empty states, and dynamic register/cancel actions.
- **Independent Execution:** Operates completely standalone using mock data and localStorage without needing an active backend.

## Execution Instructions
1. Navigate to this directory:
   ```bash
   cd Program-2-React
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL (typically `http://localhost:5173`) in your browser.
5. To test building for production:
   ```bash
   npm run build
   ```
