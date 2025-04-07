"use strict";
// This file defines book related routes
// Maps API endpoints to corresponding controller methods
// This file defines the routes for handling book-related API endpoints in your application. 
// It maps HTTP requests (e.g., POST, GET, PUT, DELETE) to specific controller methods in the BookController and applies middleware for validation.
// It uses Express Router to define the routes and their corresponding HTTP methods. 
// The routes are organized in a way that makes it easy to understand the API structure and functionality.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = __importDefault(require("../controllers/bookController"));
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/books
 * @desc    Create a new book
 * @access  Public
 */
router.post('/', validationMiddleware_1.validateBook, bookController_1.default.createBook);
/**
 * @route   GET /api/books
 * @desc    Get all books with optional filtering
 * @access  Public
 */
router.get('/', bookController_1.default.getBooks);
/**
 * @route   GET /api/books/:id
 * @desc    Get a book by ID
 * @access  Public
 */
router.get('/:id', validationMiddleware_1.validateIdParam, bookController_1.default.getBookById);
/**
 * @route   PUT /api/books/:id
 * @desc    Update a book
 * @access  Public
 */
router.put('/:id', validationMiddleware_1.validateIdParam, validationMiddleware_1.validateBook, bookController_1.default.updateBook);
/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book
 * @access  Public
 */
router.delete('/:id', validationMiddleware_1.validateIdParam, bookController_1.default.deleteBook);
exports.default = router;
