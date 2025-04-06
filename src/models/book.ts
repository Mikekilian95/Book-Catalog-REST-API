// This file defines the Book Model & the SQLite database schema and any TypeScript interfaces.

import { getDatabase } from '../config/db';
import logger from '../utils/logger';

export interface Book {
  id?: number;
  title: string;
  author: string;
  published_date?: string;
  genre?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: number; 
}

export interface BookFilter {
  title?: string;
  author?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

class BookModel {

  // Create a new book
  // This method will be used to create a new book in the database
  async create(book: Book): Promise<Book> {
    try {
      const db = getDatabase();
      const result = await db.run(
        `INSERT INTO books (title, author, published_date, genre)
         VALUES (?, ?, ?, ?)`,
        [book.title, book.author, book.published_date || null, book.genre || null]
      );
      
      const newBook = await this.findById(result.lastID!);
      logger.info(`Book created with ID: ${result.lastID}`);
      
      return newBook!;
    } catch (error) {
      logger.error('Error creating book:', error);
      throw error;
    }
  }

  // Find book by ID
  async findById(id: number): Promise<Book | null> {
    try {
      const db = getDatabase();
      const book = await db.get(
        `SELECT * FROM books WHERE id = ? AND is_deleted = 0`,
        [id]
      );
      
      return book || null;
    } catch (error) {
      logger.error(`Error finding book with ID ${id}:`, error);
      throw error;
    }
  }



  // Get all books with optional filtering and pagination
  async findAll(filter: BookFilter = {}): Promise<{ books: Book[], total: number }> {
    try {
      const { title, author, genre, page = 1, limit = 10 } = filter;
      const offset = (page - 1) * limit;
      
      const db = getDatabase();
      let query = `SELECT * FROM books WHERE is_deleted = 0`;
      let countQuery = `SELECT COUNT(*) as count FROM books WHERE is_deleted = 0`;
      const params: any[] = [];
      const countParams: any[] = [];
      
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
      const books = await db.all(query, params);
      const countResult = await db.get(countQuery, countParams);
      
      return {
        books,
        total: countResult?.count || 0
      };
    } catch (error) {
      logger.error('Error finding books:', error);
      throw error;
    }
  }

  // Update a book by ID
  // This method will be used to update a book in the database
  async update(id: number, bookData: Partial<Book>): Promise<Book | null> {
    try {
      const db = getDatabase();
      const existingBook = await this.findById(id);
      
      if (!existingBook) {
        return null;
      }
      
      const { title, author, published_date, genre } = bookData;
      let query = `UPDATE books SET updated_at = CURRENT_TIMESTAMP`;
      const params: any[] = [];
      
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
      
      await db.run(query, params);
      logger.info(`Book updated with ID: ${id}`);
      
      return this.findById(id);
    } catch (error) {
      logger.error(`Error updating book with ID ${id}:`, error);
      throw error;
    }
  }

  // Soft delete a book by ID
  // This method will be used to soft delete a book in the database
  async delete(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const existingBook = await this.findById(id);
      
      if (!existingBook) {
        return false;
      }
      
      await db.run(
        `UPDATE books SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
      
      logger.info(`Book soft deleted with ID: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting book with ID ${id}:`, error);
      throw error;
    }
  }

  // Hard delete a book by ID
  // This method will be used to hard delete a book in the database
  async hardDelete(id: number): Promise<boolean> {
    try {
      const db = getDatabase();
      const result = await db.run(`DELETE FROM books WHERE id = ?`, [id]);

      // Safely check if 'changes' is defined and greater than 0
      // Had to use GitHub Copliot to figure out how to do this because I was getting and error on the result.changes
      // and I couldn't figure out how to fix it.
      const changes = result.changes ?? 0; // Use nullish coalescing to default to 0
      logger.info(`Book hard deleted with ID: ${id}`);
      return changes > 0;
    } catch (error) {
      logger.error(`Error hard deleting book with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new BookModel();