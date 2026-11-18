/**
 * Database Setup & Migration Script for PostgreSQL
 * Connects via 'pg', executes schema.sql and seed.sql, and verifies constraints.
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/college_events';

console.log('Connecting to PostgreSQL using pg library...');
console.log(`Target: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function runSetup() {
  const client = await pool.connect();
  try {
    console.log('\n1. Connected successfully to PostgreSQL.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    console.log('2. Reading schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('3. Executing schema.sql (users, events, registrations)...');
    await client.query(schemaSql);
    console.log('   Schema applied successfully.');

    console.log('4. Reading seed.sql...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('5. Executing seed.sql...');
    await client.query(seedSql);
    console.log('   Seed data loaded successfully.');

    // Verification queries
    console.log('\n--- VERIFICATION OF DATABASE TABLES ---');
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const eventsCount = await client.query('SELECT COUNT(*) FROM events');
    const regsCount = await client.query('SELECT COUNT(*) FROM registrations');

    console.log(`Users in database:         ${usersCount.rows[0].count}`);
    console.log(`Events in database:        ${eventsCount.rows[0].count}`);
    console.log(`Registrations in database: ${regsCount.rows[0].count}`);

    console.log('\nDatabase setup completed successfully without errors!');
  } catch (err) {
    console.error('\nDatabase setup error:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runSetup();
}

module.exports = { runSetup, pool };
