// This file defines book related routes
// Maps API endpoints to corresponding controller methods
// This file defines the routes for handling book-related API endpoints in your application. 
// It maps HTTP requests (e.g., POST, GET, PUT, DELETE) to specific controller methods in the BookController and applies middleware for validation.
// It uses Express Router to define the routes and their corresponding HTTP methods. 
// The routes are organized in a way that makes it easy to understand the API structure and functionality.



import { Router } from 'express';
import BookController from '../controllers/bookController';
import { validateBook, validateIdParam } from '../middleware/validationMiddleware';

const router = Router();

/**
 * @route   POST /api/books
 * @desc    Create a new book
 * @access  Public
 */
router.post('/', validateBook, BookController.createBook);

/**
 * @route   GET /api/books
 * @desc    Get all books with optional filtering
 * @access  Public
 */
router.get('/', BookController.getBooks);

/**
 * @route   GET /api/books/:id
 * @desc    Get a book by ID
 * @access  Public
 */
router.get('/:id', validateIdParam, BookController.getBookById);

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book
 * @access  Public
 */
router.put('/:id', validateIdParam, validateBook, BookController.updateBook);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book
 * @access  Public
 */
router.delete('/:id', validateIdParam, BookController.deleteBook);

export default router;