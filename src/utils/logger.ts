// This file defines the logging fucntions
// TODO: Logging levels for info, warning, and error logs
// Makes use of the Winston logger library to log messages to the console and a file
// Research was done on the Winston Logger library for best practices and usage
// I would normally just use the console.log() method to log messages to the console, but I wanted to use a more robust logging library for this project


import winston from 'winston';
import path from 'path';
import { config } from '../config/env';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} ${level}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Create logger
const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'book-api' },
  transports: [
    // - Write all logs to console
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

// In production, write logs to files
if (config.NODE_ENV === 'production') {
  // - Write errors to error.log
  logger.add(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  
  // Write all logs to combined.log
  logger.add(
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

// Create a stream object for Morgan HTTP logger
// This is used to log HTTP requests to the console and files
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
