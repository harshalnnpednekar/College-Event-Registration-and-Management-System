-- ============================================================================
-- COLLEGE EVENT REGISTRATION AND MANAGEMENT SYSTEM
-- PostgreSQL Seed Data
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED USERS
-- Passwords:
-- Admin: admin@college.edu / Admin@123
-- Students: *.doe@college.edu / Student@123
-- (Bcrypt hashes generated with 10 salt rounds)
-- ----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(1, 'Administrator', 'admin@college.edu', '$2a$10$8v8mQGZ/PjYhO3C0KzP8se4lYyU6WzY8V24rFv6dD2zR5eT7a1u0m', 'admin', NOW()),
(2, 'John Doe', 'john.doe@college.edu', '$2a$10$7v7mQGZ/PjYhO3C0KzP8se4lYyU6WzY8V24rFv6dD2zR5eT7a1u0m', 'student', NOW()),
(3, 'Jane Smith', 'jane.smith@college.edu', '$2a$10$7v7mQGZ/PjYhO3C0KzP8se4lYyU6WzY8V24rFv6dD2zR5eT7a1u0m', 'student', NOW()),
(4, 'Alex Rivera', 'alex.rivera@college.edu', '$2a$10$7v7mQGZ/PjYhO3C0KzP8se4lYyU6WzY8V24rFv6dD2zR5eT7a1u0m', 'student', NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for users
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- ----------------------------------------------------------------------------
-- 2. SEED EVENTS
-- ----------------------------------------------------------------------------
INSERT INTO events (id, title, description, category, venue, event_date, total_seats, available_seats, status, created_at) VALUES
(1, 'National Hackathon 2026: CodeCrafters', '36-hour non-stop hackathon challenging students to build innovative AI, Web3, and IoT solutions for real-world problems.', 'Technical', 'Campus Innovation Hub & Lab 4', NOW() + INTERVAL '5 days', 120, 24, 'Open', NOW()),
(2, 'Aura 2026: Annual Inter-College Cultural Fest', 'A vibrant celebration of music, dance, theatrical acts, photography exhibitions, and battle of the college bands.', 'Cultural', 'Main University Auditorium', NOW() + INTERVAL '10 days', 500, 85, 'Open', NOW()),
(3, 'Generative AI & LLM Systems Hands-on Workshop', 'Master prompt engineering, retrieval-augmented generation (RAG), vector embeddings, and LangChain integration.', 'Workshop', 'Computer Center Room 201', NOW() + INTERVAL '7 days', 60, 4, 'Fast Filling', NOW()),
(4, 'Inter-Department Cricket & Football Tournament', 'Annual sporting extravaganza featuring T20 cricket clashes, 7-a-side football matches, and track & field heats.', 'Sports', 'University Sports Ground', NOW() + INTERVAL '13 days', 150, 60, 'Open', NOW()),
(5, 'Future of Cloud Computing & DevOps Seminar', 'Industry keynote on microservices architectures, Kubernetes orchestration, CI/CD pipelines, and cloud security.', 'Seminar', 'Seminar Hall B (Block 3)', NOW() + INTERVAL '15 days', 80, 0, 'Closed', NOW()),
(6, 'CyberShield: Ethical Hacking & Security Bootcamp', 'Learn penetration testing fundamentals, web application security (OWASP Top 10), and capture-the-flag (CTF) challenges.', 'Workshop', 'Cyber Security Research Lab', NOW() + INTERVAL '20 days', 50, 12, 'Open', NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset sequence for events
SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));

-- ----------------------------------------------------------------------------
-- 3. SEED REGISTRATIONS
-- ----------------------------------------------------------------------------
INSERT INTO registrations (id, user_id, event_id, registration_date, status) VALUES
(1, 2, 1, NOW() - INTERVAL '2 days', 'confirmed'),
(2, 2, 2, NOW() - INTERVAL '1 day', 'confirmed'),
(3, 3, 1, NOW() - INTERVAL '1 day', 'confirmed'),
(4, 4, 3, NOW() - INTERVAL '3 hours', 'confirmed')
ON CONFLICT (user_id, event_id) DO NOTHING;

-- Reset sequence for registrations
SELECT setval('registrations_id_seq', (SELECT MAX(id) FROM registrations));
