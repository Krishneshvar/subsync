import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT) : 10,
  queueLimit: process.env.DB_QUEUE_LIMIT ? parseInt(process.env.DB_QUEUE_LIMIT) : 100,
  acquireTimeout: process.env.DB_ACQUIRE_TIMEOUT ? parseInt(process.env.DB_ACQUIRE_TIMEOUT) : 10000,
  // idleTimeout: 60000, // Optional: Close idle connections after this duration (milliseconds)
  // enableKeepAlive: true, // Optional: Keep connections alive to prevent them from being closed by proxies/firewalls.

  // SSL/TLS Configuration for Production (Highly Recommended)
  ssl: process.env.NODE_ENV === 'production' && process.env.DB_USE_SSL === 'true' ? {
    rejectUnauthorized: true,
  } : false, // Set to false or remove for development if SSL is not configured
};

/**
 * Creates the database connection pool.
 * @type {mysql.Pool}
 */
const appDB = mysql.createPool(poolConfig);

/**
 * Attaches event listeners to the connection pool for better observability.
 */
appDB.on('connection', (connection) => {
  logger.debug(`[DB] Connection established from pool. ID: ${connection.threadId}`);
});

appDB.on('acquire', (connection) => {
  logger.debug(`[DB] Connection ${connection.threadId} acquired from pool.`);
});

appDB.on('release', (connection) => {
  logger.debug(`[DB] Connection ${connection.threadId} released back to pool.`);
});

appDB.on('error', (err) => {
  logger.error(`[DB] Database pool error:`, err);
});

/**
 * Tests the database connection pool.
 * This should be called once on application startup.
 * @returns {Promise<void>}
 */
async function testConnection() {
  try {
    const connection = await appDB.getConnection();
    logger.info('[DB] Successfully connected to the database and acquired a connection from the pool.');
    connection.release();
    logger.info('[DB] Database connection test successful.');
  } catch (err) {
    logger.error('[DB] Database connection error:', err);
    process.exit(1);
  }
}

/**
 * Closes the database connection pool gracefully.
 * This should be called when the application is shutting down.
 * @returns {Promise<void>}
 */
async function closeDbConnectionPool() {
  try {
    await appDB.end();
    logger.info('[DB] Database connection pool closed gracefully.');
  } catch (err) {
    logger.error('[DB] Error closing database connection pool:', err);
  }
}

testConnection();

export default appDB;
export { closeDbConnectionPool };
