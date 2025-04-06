// This file is used to test the Book model class, testing its methods in isolation.
// Mocha and Chai testing framworks are used for testing, and Sinon is used for mocking the database interactions.
// Spies: Observe and record function behavior without altering it.
// Stubs: Replace a function's implementation with controlled behavior.
// Mocks: Combine stubbing with expectations and verifications.

import { expect } from 'chai';
import sinon from 'sinon';
import BookModel, { Book } from '../../src/models/book';
import * as db from '../../src/config/db';

// This test file is used to test the BookModel class and its methods
// It uses Sinon for mocking and Chai for assertions
// Ran npm install --save-dev chai sinon @types/sinon to install the required packages
// Also needed Jest & Mocha in the devDependencies in package.json
// npm install --save-dev jest mocha @types/jest @types/mocha ts-jest
// The 'describe' and 'beforeEach' functions were throwing errors without these packages in the devDependencies

describe('Book Model', () => {
  let mockDb: any;
  let getDbStub: sinon.SinonStub;

  const sampleBook: Book = {
    title: 'Test Book',
    author: 'Test Author',
    published_date: '2023-01-01',
    genre: 'Test Genre'
  };
  
  beforeEach(() => {
    // Create mock database methods
    mockDb = {
      get: sinon.stub(),
      all: sinon.stub(),
      run: sinon.stub().resolves({ lastID: 1, changes: 1 })
    };
    
    // Stub the getDatabase function to return our mock
    getDbStub = sinon.stub(db, 'getDatabase').returns(mockDb);
  });
  
  afterEach(() => {
    // Restore all stubs
    sinon.restore();
  });
  
  describe('create', () => {
    it('should create a new book', async () => {
      // Setup the stubs to return expected values
      mockDb.get.resolves({
        id: 1,
        ...sampleBook,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        is_deleted: 0
      });
      
      // Call the method being tested
      const result = await BookModel.create(sampleBook);
      
      // Assertions
      expect(mockDb.run.calledOnce).to.be.true;
      expect(result).to.have.property('id', 1);
      expect(result).to.have.property('title', sampleBook.title);
      expect(result).to.have.property('author', sampleBook.author);
    });
    
    it('should throw an error if database operation fails', async () => {
      // Setup the stub to throw an error
      mockDb.run.rejects(new Error('Database error'));
      
      // Call the method and expect it to throw
      try {
        await BookModel.create(sampleBook);
        // If we get here, the test should fail
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.equal('Database error');
      }
    });
  });
  
  describe('findById', () => {
    it('should return a book when found', async () => {
      // Setup the mock
      const expectedBook = {
        id: 1,
        ...sampleBook,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        is_deleted: 0
      };
      mockDb.get.resolves(expectedBook);
      
      // Call the method
      const result = await BookModel.findById(1);
      
      // Assertions
      expect(mockDb.get.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedBook);
    });
    
    it('should return null when book not found', async () => {
      // Setup the mock to return null (book not found)
      mockDb.get.resolves(null);
      
      // Call the method
      const result = await BookModel.findById(999);
      
      // Assertions
      expect(mockDb.get.calledOnce).to.be.true;
      expect(result).to.be.null;
    });
  });
  
  describe('findAll', () => {
    it('should return books with pagination info', async () => {
      // Setup the mocks
      const books = [
        {
          id: 1,
          title: 'Book 1',
          author: 'Author 1',
          genre: 'Fiction',
          published_date: '2023-01-01',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
          is_deleted: 0
        },
        {
          id: 2,
          title: 'Book 2',
          author: 'Author 2',
          genre: 'Non-Fiction',
          published_date: '2023-02-01',
          created_at: '2023-02-01T00:00:00.000Z',
          updated_at: '2023-02-01T00:00:00.000Z',
          is_deleted: 0
        }
      ];
      
      mockDb.all.resolves(books);
      mockDb.get.resolves({ count: 2 });
      
      // Call the method
      const result = await BookModel.findAll({ page: 1, limit: 10 });
      
      // Assertions
      expect(mockDb.all.calledOnce).to.be.true;
      expect(mockDb.get.calledOnce).to.be.true;
      expect(result).to.have.property('books').with.lengthOf(2);
      expect(result).to.have.property('total', 2);
    });
    
    it('should apply filters correctly', async () => {
      // Setup the mocks
      mockDb.all.resolves([]);
      mockDb.get.resolves({ count: 0 });
      
      // Call the method with filters
      await BookModel.findAll({
        title: 'Test',
        author: 'Author',
        genre: 'Fiction'
      });
      
      // Check if the first call argument (SQL query) contains the filter conditions
      const sqlQuery = mockDb.all.getCall(0).args[0];
      expect(sqlQuery).to.include('title LIKE ?');
      expect(sqlQuery).to.include('author LIKE ?');
      expect(sqlQuery).to.include('genre LIKE ?');
      
      // Check if the parameters were passed correctly
      const params = mockDb.all.getCall(0).args[1];
      expect(params).to.include('%Test%');
      expect(params).to.include('%Author%');
      expect(params).to.include('%Fiction%');
    });
  });
  
  describe('update', () => {
    beforeEach(() => {
      // Setup the mock to return a book for findById
      mockDb.get.resolves({
        id: 1,
        ...sampleBook,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        is_deleted: 0
      });
    });
    
    it('should update a book successfully', async () => {
      // Call the method
      const updateData = { title: 'Updated Title', genre: 'Updated Genre' };
      await BookModel.update(1, updateData);
      
      // Assertions
      expect(mockDb.run.calledOnce).to.be.true;
      
      // Check if SQL and parameters are correct
      const sqlQuery = mockDb.run.getCall(0).args[0];
      expect(sqlQuery).to.include('UPDATE books SET');
      expect(sqlQuery).to.include('title = ?');
      expect(sqlQuery).to.include('genre = ?');
      
      const params = mockDb.run.getCall(0).args[1];
      expect(params).to.include('Updated Title');
      expect(params).to.include('Updated Genre');
    });
    
    it('should return null when the book is not found', async () => {
      // Override the mock to return null (book not found)
      mockDb.get.resolves(null);
      
      // Call the method
      const result = await BookModel.update(999, { title: 'New Title' });
      
      // Assertions
      expect(result).to.be.null;
      expect(mockDb.run.called).to.be.false; // Run should not be called
    });
  });
  
  describe('delete', () => {
    beforeEach(() => {
      // Setup the mock to return a book for findById
      mockDb.get.resolves({
        id: 1,
        ...sampleBook,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        is_deleted: 0
      });
    });
    
    it('should soft delete a book successfully', async () => {
      // Call the method
      const result = await BookModel.delete(1);
      
      // Assertions
      expect(result).to.be.true;
      expect(mockDb.run.calledOnce).to.be.true;
      
      // Check if SQL is correct
      const sqlQuery = mockDb.run.getCall(0).args[0];
      expect(sqlQuery).to.include('UPDATE books SET is_deleted = 1');
    });
    
    it('should return false when the book is not found', async () => {
      // Override the mock to return null (book not found)
      mockDb.get.resolves(null);
      
      // Call the method
      const result = await BookModel.delete(999);
      
      // Assertions
      expect(result).to.be.false;
      expect(mockDb.run.called).to.be.false; // Run should not be called
    });
  });
});
