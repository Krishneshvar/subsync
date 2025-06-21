import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import colors from 'colors'

dotenv.config();

/**
 * Function to create a database connection pool
 * @type {Pool}
 */
const appDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
});

/**
 * Database connection pool function call
 * @returns {Promise<void>}
 */
async function testConnection() {
  try {
    const connection = await appDB.getConnection();
    console.log('Connected to appDB'.bgGreen.white);
    await connection.release();
  }
  catch (err) {
    console.error('Database connection error:\n', err.stack);
  }
}

testConnection();

export default appDB;
