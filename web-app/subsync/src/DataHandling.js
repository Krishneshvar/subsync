import express from "express";
import pg from "pg";
import 'dotenv/config'

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

db.connect();

async function getLoginValidation(usrname, pass) {
  const passwd = await db.query(
    "SELECT password FROM users WHERE username = $1",
    [usrname]
  );

  return pass == passwd;
}

export { getLoginValidation }
