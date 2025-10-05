// test-db-connection.js
require("dotenv").config();
const { Pool } = require("pg");

// Make sure your DATABASE_URL is in your .env file
// e.g., DATABASE_URL=postgresql://user:pass@host:port/dbname?sslmode=require

const dbParams = {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Render Postgres
};

const pool = new Pool(dbParams);

(async () => {
  try {
    console.log("Connecting to DB...");
    const client = await pool.connect(); // wait for the connection
    console.log("✅ Connected successfully!");

    // Optional: test a query
    const res = await client.query("SELECT NOW()");
    console.log("Server time:", res.rows[0]);

    client.release(); // release the client back to the pool
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await pool.end(); // close the pool when done
    console.log("Connection closed.");
  }
})();
