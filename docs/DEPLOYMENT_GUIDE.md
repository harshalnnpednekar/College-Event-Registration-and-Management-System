# DEPLOYMENT GUIDE: VERCEL (FRONTEND) & RENDER (BACKEND)
## College Event Registration and Management System
**Student Roll No:** 41 | **Branch:** B.E. (AI & DS) | **Semester:** V  
**Database:** PostgreSQL (Render PostgreSQL / Neon / Supabase)

---

## 1. ARCHITECTURE OVERVIEW

```
┌──────────────────────────────┐                ┌──────────────────────────────┐
│        VERCEL (FRONTEND)     │   HTTPS REST   │       RENDER (BACKEND)       │
│  React SPA + Vite            │───────────────▶│  Node.js + Express API       │
│  https://your-app.vercel.app │   JWT Bearer   │  https://your-api.render.com │
└──────────────────────────────┘                └──────────────┬───────────────┘
                                                               │ node-postgres (pg)
                                                               ▼
                                                ┌──────────────────────────────┐
                                                │      POSTGRESQL DATABASE     │
                                                │  Render / Neon / Supabase    │
                                                │  Port 5432 with SSL          │
                                                └──────────────────────────────┘
```

---

## 2. BACKEND DEPLOYMENT ON RENDER

### Step 2.1: Create a PostgreSQL Database on Render
1. Log in to [Render](https://render.com).
2. Click **New +** &rarr; **PostgreSQL**.
3. Set:
   - **Name:** `college-events-db`
   - **Database:** `college_events`
   - **User:** `postgres`
   - **Region:** Nearest region (e.g. Singapore / Frankfurt / Oregon)
   - **Plan:** Free
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (if backend is on Render) or **External Database URL**.

### Step 2.2: Apply Schema and Seed Data
Connect to your remote Render database using `psql`:
```bash
psql "<YOUR_RENDER_EXTERNAL_DATABASE_URL>" -f Program-5-Full-Stack/database/schema.sql
psql "<YOUR_RENDER_EXTERNAL_DATABASE_URL>" -f Program-5-Full-Stack/database/seed.sql
```

### Step 2.3: Deploy Express Backend Web Service
1. On Render, click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name:** `college-event-backend`
   - **Root Directory:** `Program-5-Full-Stack/backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: *(Paste your Render PostgreSQL connection string)*
   - `DATABASE_SSL`: `true`
   - `JWT_SECRET`: *(A long random secret string)*
5. Click **Deploy Web Service**.
6. Once deployed, note your backend URL: e.g., `https://college-event-backend.onrender.com`.

---

## 3. FRONTEND DEPLOYMENT ON VERCEL

### Step 3.1: Configure Vercel Routing
The file `Program-5-Full-Stack/frontend/vercel.json` is already pre-configured:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://college-event-backend.onrender.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 3.2: Deploy via Vercel Dashboard
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Import your GitHub repository.
4. Set:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and choose `Program-5-Full-Stack/frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**.
6. Your React client is live with HTTPS!

---

## 4. VERIFYING LIVE CLOUD DEPLOYMENT

1. Open your Vercel deployment URL (e.g. `https://college-events.vercel.app`).
2. Verify live event cards are loaded directly from the Render PostgreSQL backend.
3. Click **Log In** &rarr; select **Quick Demo Logins** (Admin: `admin@college.edu` / `Admin@123` or Student: `john.doe@college.edu` / `Student@123`).
4. Test reserving a seat & verifying that the PostgreSQL database decrements available seats in real-time.
5. Inspect the Admin Dashboard &rarr; verify real-time SQL aggregation stats.
