"use strict";
// This file will be used for environment configuration, type safety and strict control over the configuration values used.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Environment configuration with defaults and type validation
exports.config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    // DB_PATH: process.env.DB_PATH || path.resolve(__dirname, '../../database.sqlite'),
    DB_PATH: process.env.DB_PATH || 'C:\\Users\\Michael\\Desktop\\libraryDB.db', // my local path for testing
    // DB_PATH: process.env.DB_PATH || path.join(__dirname, '../../libraryDB.db'), // Relative path for production
    // DB_PATH: process.env.DB_PATH || '', // No hardcoded fallback
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
};
// Validate required environment variables in production
if (exports.config.NODE_ENV === 'production') {
    const requiredEnvVars = ['DB_PATH'];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Environment variable ${envVar} is required in production mode.`);
        }
    }
}
