"use strict";
// Tjis middleware file defines the logic for handling errors
// TODO: Can also be used for Rate Limiting and Payload Compression using the Express library
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorMiddleware = exports.AppError = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
// Custom error class for operational errors
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        // Capture stack trace for debugging
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// errorMiddleware function
// This function will be used to handle errors in the application
// It handles errors that occur during request processing.
// Logs the error and sends a standardized error response to the client.
// Differentiates between operational errors (like validation errors) and unexpected errors (like server crashes).
const errorMiddleware = (err, req, res, next) => {
    // Set default error
    let error = err;
    let statusCode = 500;
    // Handle specific error types
    if (err.statusCode) {
        statusCode = err.statusCode;
    }
    else if (err.name === 'ValidationError') {
        statusCode = 400;
    }
    // Log error
    if (statusCode >= 500) {
        logger_1.default.error(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);
        logger_1.default.error(err.stack);
    }
    else {
        logger_1.default.warn(`[${req.method}] ${req.path} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);
    }
    // Return standardized error response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.errorMiddleware = errorMiddleware;
// Middleware for handling 404 errors
// 404 handler for routes that don't exist
const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Cannot find ${req.originalUrl} on this server!`, 404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
