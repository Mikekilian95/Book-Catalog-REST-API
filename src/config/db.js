"use strict";
// This file handles the datatbase connections configuration to the SQLite database
// and the database schema for the books table.
// It also includes the database connection and initialization functions.
// It uses the sqlite3 and sqlite packages to manage the SQLite database connection and queries.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.getDatabase = getDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const env_1 = require("./env");
const logger_1 = __importDefault(require("../utils/logger"));
const path_1 = __importDefault(require("path"));
let db;
// * Connect to the SQLite database
// * This function will be used to connect to the SQLite database and create the tables if they don't exist
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        if (db) {
            return db;
        }
        try {
            // Ensure the directory exists
            const dbDir = path_1.default.dirname(env_1.config.DB_PATH);
            // Open database connection
            db = yield (0, sqlite_1.open)({
                filename: env_1.config.DB_PATH,
                driver: sqlite3_1.default.Database
            });
            logger_1.default.info(`Connected to SQLite database at ${env_1.config.DB_PATH}`);
            // Enable foreign keys
            yield db.exec('PRAGMA foreign_keys = ON');
            // Create tables if they don't exist
            yield initializeTables();
            return db;
        }
        catch (error) {
            logger_1.default.error('Database connection error:', error);
            throw error;
        }
    });
}
// * Initialize database tables
// * This function will be used to create the tables in the SQLite database if they don't exist
function initializeTables() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create books table
            yield db.exec(`
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
            logger_1.default.info('Database tables initialized');
        }
        catch (error) {
            logger_1.default.error('Error initializing database tables:', error);
            throw error;
        }
    });
}
// * Close the database connection
// Get database instance
function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
}
