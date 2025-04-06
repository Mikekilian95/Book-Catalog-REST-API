// Tjis middleware file defines the logic for handling errors
// TODO: Can also be used for Rate Limiting and Payload Compression using the Express library

import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Custom error class for operational errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    // Capture stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

// errorMiddleware function
// This function will be used to handle errors in the application
// It handles errors that occur during request processing.
// Logs the error and sends a standardized error response to the client.
// Differentiates between operational errors (like validation errors) and unexpected errors (like server crashes).
export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default error
  let error = err;
  let statusCode = 500;
  
  // Handle specific error types
  if ((err as AppError).statusCode) {
    statusCode = (err as AppError).statusCode;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
  }
  
  // Log error
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);
    logger.error(err.stack);
  } else {
    logger.warn(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);
  }
  
  // Return standardized error response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};


// Middleware for handling 404 errors
// 404 handler for routes that don't exist
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Cannot find ${req.originalUrl} on this server!`, 404);
  next(error);
};