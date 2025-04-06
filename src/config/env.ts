// This file will be used for environment configuration, type safety and strict control over the configuration values used.

import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  NODE_ENV: string;
  PORT: number;
  DB_PATH: string;
  LOG_LEVEL: string;
  JWT_SECRET?: string; // Optional for authentication enhancement
  JWT_EXPIRES_IN?: string;
}

// Environment configuration with defaults and type validation
export const config: Config = {
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
if (config.NODE_ENV === 'production') {
  const requiredEnvVars: Array<keyof Config> = ['DB_PATH'];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Environment variable ${envVar} is required in production mode.`);
    }
  }
}
