-- ============================================================================
-- COLLEGE EVENT REGISTRATION AND MANAGEMENT SYSTEM
-- PostgreSQL Database Schema
-- Database: PostgreSQL ONLY (No MongoDB/NoSQL)
-- ============================================================================

-- Drop tables if they exist in correct reverse-dependency order
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for rapid user lookup during authentication
CREATE INDEX idx_users_email ON users(email);

-- ----------------------------------------------------------------------------
-- 2. EVENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Technical', 'Cultural', 'Workshop', 'Sports', 'Seminar')),
    venue VARCHAR(150) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_seats INTEGER NOT NULL CHECK (total_seats > 0),
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0 AND available_seats <= total_seats),
    status VARCHAR(30) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Fast Filling', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient event filtering and search
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);

-- ----------------------------------------------------------------------------
-- 3. REGISTRATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    
    -- Crucial: Ensure one student cannot register multiple times for the same event
    CONSTRAINT uq_user_event_registration UNIQUE (user_id, event_id)
);

-- Indexes for joins and user history queries
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_status ON registrations(status);
