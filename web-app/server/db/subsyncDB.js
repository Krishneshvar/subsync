import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const appDB = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true, // Wait for connections to be available
});

async function testConnection() {
  try {
    const connection = await appDB.getConnection();
    console.log('Connected to appDB');
    await connection.release(); // Release the connection back to the pool
  }
  catch (err) {
    console.error('Database connection error:\n', err.stack);
  }
}

testConnection();

export default appDB;
