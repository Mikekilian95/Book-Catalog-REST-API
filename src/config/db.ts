// This file handles the datatbase connections configuration to the SQLite database
// and the database schema for the books table.
// It also includes the database connection and initialization functions.
// It uses the sqlite3 and sqlite packages to manage the SQLite database connection and queries.

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { config } from './env';
import logger from '../utils/logger';
import path from 'path';

let db: Database;

// * Connect to the SQLite database
// * This function will be used to connect to the SQLite database and create the tables if they don't exist
export async function connectToDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  try {
    // Ensure the directory exists
    const dbDir = path.dirname(config.DB_PATH);
    
    // Open database connection
    db = await open({
      filename: config.DB_PATH,
      driver: sqlite3.Database
    });

    logger.info(`Connected to SQLite database at ${config.DB_PATH}`);
    
    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');
    
    // Create tables if they don't exist
    await initializeTables();
    
    return db;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
}

// * Initialize database tables
// * This function will be used to create the tables in the SQLite database if they don't exist
async function initializeTables(): Promise<void> {
  try {
    // Create books table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        published_date TEXT,
        genre TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0
      )
    `);
    
    logger.info('Database tables initialized');
  } catch (error) {
    logger.error('Error initializing database tables:', error);
    throw error;
  }
}


// * Close the database connection
// Get database instance
export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

