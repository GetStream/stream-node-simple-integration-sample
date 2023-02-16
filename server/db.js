const { Client } = require('pg');
require("dotenv").config();

const fs = require('fs');
// const sqlite3 = require("sqlite3");
// const mkdirp = require("mkdirp");
const crypto = require("crypto");

module.exports.getClient = async () => {
    const client = new Client({
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: {
        ca: fs.readFileSync('ca-certificate.crt').toString()
      }
    });
    await client.connect();
    return client;
  };
// mkdirp.sync("./var/db");

// // create the database schema for the todos app
// const createTable = () => {
//     db.query(
//         'CREATE TABLE IF NOT EXISTS public.users ( \
//         id text NOT NULL, \
//         username text NOT NULL, \
//         hashed_password bytea NOT NULL, \
//         salt bytea NOT NULL, \
//         PRIMARY KEY(id)); \
//         COMMIT;'
//         , (err, innerResult) => {
//             if (err) {
//                 print(error);
//             }
//         });
// };

// // create an initial user (username: alice, password: letmein)
// const createInitialUser = () => {
//     const salt = crypto.randomBytes(16);
//     db.query(
//         "INSERT OR IGNORE INTO users (id, username, hashed_password, salt) VALUES ($1, $2, $3, $4)",
//         [
//             "alice",
//             "alice",
//             crypto.pbkdf2Sync("letmein", salt, 310000, 32, "sha256"),
//             salt,
//         ]
//     );
// };

// createTable();
// createInitialUser();
