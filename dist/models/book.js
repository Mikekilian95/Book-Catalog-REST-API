"use strict";
// This file defines the Book Model & the SQLite database schema and any TypeScript interfaces.
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
const db_1 = require("../config/db");
const logger_1 = __importDefault(require("../utils/logger"));
class BookModel {
    // Create a new book
    // This method will be used to create a new book in the database
    create(book) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, db_1.getDatabase)();
                const result = yield db.run(`INSERT INTO books (title, author, published_date, genre)
         VALUES (?, ?, ?, ?)`, [book.title, book.author, book.published_date || null, book.genre || null]);
                const newBook = yield this.findById(result.lastID);
                logger_1.default.info(`Book created with ID: ${result.lastID}`);
                return newBook;
            }
            catch (error) {
                logger_1.default.error('Error creating book:', error);
                throw error;
            }
        });
    }
    // Find book by ID
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, db_1.getDatabase)();
                const book = yield db.get(`SELECT * FROM books WHERE id = ? AND is_deleted = 0`, [id]);
                return book || null;
            }
            catch (error) {
                logger_1.default.error(`Error finding book with ID ${id}:`, error);
                throw error;
            }
        });
    }
    // Get all books with optional filtering and pagination
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                const { title, author, genre, page = 1, limit = 10 } = filter;
                const offset = (page - 1) * limit;
                const db = (0, db_1.getDatabase)();
                let query = `SELECT * FROM books WHERE is_deleted = 0`;
                let countQuery = `SELECT COUNT(*) as count FROM books WHERE is_deleted = 0`;
                const params = [];
                const countParams = [];
                // Add filters if provided
                if (title) {
                    query += ` AND title LIKE ?`;
                    countQuery += ` AND title LIKE ?`;
                    params.push(`%${title}%`);
                    countParams.push(`%${title}%`);
                }
                if (author) {
                    query += ` AND author LIKE ?`;
                    countQuery += ` AND author LIKE ?`;
                    params.push(`%${author}%`);
                    countParams.push(`%${author}%`);
                }
                if (genre) {
                    query += ` AND genre LIKE ?`;
                    countQuery += ` AND genre LIKE ?`;
                    params.push(`%${genre}%`);
                    countParams.push(`%${genre}%`);
                }
                // Add pagination
                query += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
                params.push(limit, offset);
                // Execute queries
                const books = yield db.all(query, params);
                const countResult = yield db.get(countQuery, countParams);
                return {
                    books,
                    total: (countResult === null || countResult === void 0 ? void 0 : countResult.count) || 0
                };
            }
            catch (error) {
                logger_1.default.error('Error finding books:', error);
                throw error;
            }
        });
    }
    // Update a book by ID
    // This method will be used to update a book in the database
    update(id, bookData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, db_1.getDatabase)();
                const existingBook = yield this.findById(id);
                if (!existingBook) {
                    return null;
                }
                const { title, author, published_date, genre } = bookData;
                let query = `UPDATE books SET updated_at = CURRENT_TIMESTAMP`;
                const params = [];
                if (title !== undefined) {
                    query += `, title = ?`;
                    params.push(title);
                }
                if (author !== undefined) {
                    query += `, author = ?`;
                    params.push(author);
                }
                if (published_date !== undefined) {
                    query += `, published_date = ?`;
                    params.push(published_date);
                }
                if (genre !== undefined) {
                    query += `, genre = ?`;
                    params.push(genre);
                }
                query += ` WHERE id = ?`;
                params.push(id);
                yield db.run(query, params);
                logger_1.default.info(`Book updated with ID: ${id}`);
                return this.findById(id);
            }
            catch (error) {
                logger_1.default.error(`Error updating book with ID ${id}:`, error);
                throw error;
            }
        });
    }
    // Soft delete a book by ID
    // This method will be used to soft delete a book in the database
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = (0, db_1.getDatabase)();
                const existingBook = yield this.findById(id);
                if (!existingBook) {
                    return false;
                }
                yield db.run(`UPDATE books SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
                logger_1.default.info(`Book soft deleted with ID: ${id}`);
                return true;
            }
            catch (error) {
                logger_1.default.error(`Error deleting book with ID ${id}:`, error);
                throw error;
            }
        });
    }
    // Hard delete a book by ID
    // This method will be used to hard delete a book in the database
    hardDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const db = (0, db_1.getDatabase)();
                const result = yield db.run(`DELETE FROM books WHERE id = ?`, [id]);
                // Safely check if 'changes' is defined and greater than 0
                // Had to use GitHub Copliot to figure out how to do this because I was getting and error on the result.changes
                // and I couldn't figure out how to fix it.
                const changes = (_a = result.changes) !== null && _a !== void 0 ? _a : 0; // Use nullish coalescing to default to 0
                logger_1.default.info(`Book hard deleted with ID: ${id}`);
                return changes > 0;
            }
            catch (error) {
                logger_1.default.error(`Error hard deleting book with ID ${id}:`, error);
                throw error;
            }
        });
    }
}
exports.default = new BookModel();
