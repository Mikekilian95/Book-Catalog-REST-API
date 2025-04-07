"use strict";
// This file will define the logic for handling different API requests
// Used for CRUD functions & Handles book-related API business logic
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
const book_1 = __importDefault(require("../models/book"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
const logger_1 = __importDefault(require("../utils/logger"));
class BookController {
    // Create a new book
    // Used to create a new book in the database
    createBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookData = req.body;
                const book = yield book_1.default.create(bookData);
                logger_1.default.info(`Book created: ${book.title} by ${book.author}`);
                res.status(201).json({
                    success: true,
                    data: book
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get all books with optional filtering and pagination
    // Used to retrieve a list of books from the database
    // Supports filtering by title, author, and genre 
    getBooks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, author, genre, page, limit } = req.query;
                const filter = {
                    title: title,
                    author: author,
                    genre: genre,
                    page: page ? parseInt(page, 10) : undefined,
                    limit: limit ? parseInt(limit, 10) : undefined
                };
                const { books, total } = yield book_1.default.findAll(filter);
                // Calculate pagination info
                const currentPage = filter.page || 1;
                const itemsPerPage = filter.limit || 10;
                // Calculate total pages
                // Assuming total is the total number of books in the database
                const totalPages = Math.ceil(total / itemsPerPage);
                // Below is the logic for pagination
                // If the current page is greater than the total pages, set it to the last page
                res.status(200).json({
                    success: true,
                    data: books,
                    pagination: {
                        total,
                        totalPages,
                        currentPage,
                        itemsPerPage,
                        hasNextPage: currentPage < totalPages,
                        hasPrevPage: currentPage > 1
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Get a single book by ID 
    // Used to retrieve a specific book from the database
    // This is useful for displaying detailed information about a book
    getBookById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const book = yield book_1.default.findById(id);
                if (!book) {
                    throw new errorMiddleware_1.AppError(`Book not found with id ${id}`, 404);
                }
                res.status(200).json({
                    success: true,
                    data: book
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Update a book 
    // Used to update the book details
    updateBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const bookData = req.body;
                const updatedBook = yield book_1.default.update(id, bookData);
                if (!updatedBook) {
                    throw new errorMiddleware_1.AppError(`Book not found with id ${id}`, 404);
                }
                logger_1.default.info(`Book updated: ID ${id}`);
                res.status(200).json({
                    success: true,
                    data: updatedBook
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Soft delete a book
    // Used to mark a book as deleted without removing it from the database
    // This is useful for maintaining data integrity and allowing for potential recovery of deleted books
    deleteBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id, 10);
                const deleted = yield book_1.default.delete(id);
                if (!deleted) {
                    throw new errorMiddleware_1.AppError(`Book not found with id ${id}`, 404);
                }
                logger_1.default.info(`Book deleted: ID ${id}`);
                res.status(200).json({
                    success: true,
                    message: `Book with id ${id} successfully deleted`
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new BookController();
