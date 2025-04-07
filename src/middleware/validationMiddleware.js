"use strict";
// This file will be used to validate input data for the application.
// It will be used to validate the input data for the book API.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdParam = exports.validateBook = void 0;
const errorMiddleware_1 = require("./errorMiddleware");
// Validate book input data
const validateBook = (req, res, next) => {
    try {
        const { title, author, published_date, genre } = req.body;
        const errors = [];
        // Required fields
        if (!title || typeof title !== 'string' || title.trim() === '') {
            errors.push('Title is required and must be a non-empty string');
        }
        if (!author || typeof author !== 'string' || author.trim() === '') {
            errors.push('Author is required and must be a non-empty string');
        }
        // Optional fields
        // Made use of regex to validate the date format
        if (published_date !== undefined) {
            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(published_date)) {
                errors.push('Published date must be in YYYY-MM-DD format');
            }
        }
        // Validate genre (optional)
        // Genre is optional but if provided, it must be a non-empty string
        if (genre !== undefined && (typeof genre !== 'string' || genre.trim() === '')) {
            errors.push('Genre must be a non-empty string');
        }
        // If there are validation errors, return them
        if (errors.length > 0) {
            throw new errorMiddleware_1.AppError(errors.join(', '), 400);
        }
        // If no errors, proceed to the next middleware
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateBook = validateBook;
// Validate ID parameter
// This middleware will be used to validate the ID parameter in the request
// It checks if the ID is a positive integer and throws an error if it is not
const validateIdParam = (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            throw new errorMiddleware_1.AppError('Invalid ID parameter. Must be a positive integer', 400);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validateIdParam = validateIdParam;
