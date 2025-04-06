// This file will define the logic for handling different API requests
// Used for CRUD functions & Handles book-related API business logic

import { Request, Response, NextFunction } from 'express';
import BookModel, { Book, BookFilter } from '../models/book';
import { AppError } from '../middleware/errorMiddleware';
import logger from '../utils/logger';

class BookController {
    // Create a new book
    // Used to create a new book in the database
  async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookData: Book = req.body;
      const book = await BookModel.create(bookData);
      
      logger.info(`Book created: ${book.title} by ${book.author}`);
      
      res.status(201).json({
        success: true,
        data: book
      });
    } catch (error) {
      next(error);
    }
  }



  // Get all books with optional filtering and pagination
  // Used to retrieve a list of books from the database
  // Supports filtering by title, author, and genre 
  async getBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, author, genre, page, limit } = req.query;
      
      const filter: BookFilter = {
        title: title as string,
        author: author as string,
        genre: genre as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined
      };
      
      const { books, total } = await BookModel.findAll(filter);
      
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
    } catch (error) {
      next(error);
    }
  }

  // Get a single book by ID 
  // Used to retrieve a specific book from the database
  // This is useful for displaying detailed information about a book
  async getBookById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const book = await BookModel.findById(id);
      
      if (!book) {
        throw new AppError(`Book not found with id ${id}`, 404);
      }
      
      res.status(200).json({
        success: true,
        data: book
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a book 
  // Used to update the book details
  async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const bookData: Partial<Book> = req.body;
      
      const updatedBook = await BookModel.update(id, bookData);
      
      if (!updatedBook) {
        throw new AppError(`Book not found with id ${id}`, 404);
      }
      
      logger.info(`Book updated: ID ${id}`);
      
      res.status(200).json({
        success: true,
        data: updatedBook
      });
    } catch (error) {
      next(error);
    }
  }

    // Soft delete a book
    // Used to mark a book as deleted without removing it from the database
    // This is useful for maintaining data integrity and allowing for potential recovery of deleted books
  async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await BookModel.delete(id);
      
      if (!deleted) {
        throw new AppError(`Book not found with id ${id}`, 404);
      }
      
      logger.info(`Book deleted: ID ${id}`);
      
      res.status(200).json({
        success: true,
        message: `Book with id ${id} successfully deleted`
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookController();