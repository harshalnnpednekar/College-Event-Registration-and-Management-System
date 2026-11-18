/**
 * Program 4 HTTP Server Entry Point
 */

const app = require('./src/app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` CampusPulse Express REST API (Program 4)              `);
  console.log(` Port: http://localhost:${PORT}                        `);
  console.log(` Database: PostgreSQL via 'pg'                         `);
  console.log(` JWT Auth & Database Transactions Active.              `);
  console.log(`=======================================================`);
});
