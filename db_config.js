let dbParams = {};
if (process.env.DATABASE_URL) {
  dbParams = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for Render
  };
} else {
  dbParams = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  };
}

console.log("dbParams:", dbParams); // debug
module.exports = dbParams;
