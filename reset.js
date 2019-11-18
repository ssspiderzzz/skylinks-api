require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const dbParams = require("./db_config");

const db = new Pool(dbParams);

db.connect((error, client) => {
  console.log(process.env.DB_HOST);
  if (error) {
    console.log(error);
  } else {
    console.log("connected");
  }
});

function read(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      {
        encoding: "utf-8"
      },
      (error, data) => {
        if (error) return reject(error);
        resolve(data);
      }
    );
  });
}

Promise.resolve(read(path.resolve(__dirname, `db/schema/create.sql`)))
  .then(schema => {
    db.query(schema).then(() => {
      console.log(`Database has been reset successfully!`);
      db.end();
      process.exit(0);
    });
  })
  .catch(error => {
    console.log(`Error setting up the reset route: ${error}`);
  });
