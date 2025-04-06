// THis test can test the end-to-end function of the API
// This test can test the API with the database
// This file is designed to test the API with the database

import request from 'supertest'; // use supertest for HTTP assertions
import { expect } from 'chai';
import sinon from 'sinon';
import express from 'express';
import { getDatabase, connectToDatabase } from '../../src/config/db';
import bookRoutes from '../../src/routes/bookRoutes';
import { errorMiddleware } from '../../src/middleware/errorMiddleware';
import BookModel from '../../src/models/book';

describe('Book API Integration Tests', () => {
  let app: express.Application;
  let dbStub: sinon.SinonStub;

  before(async () => {
    // Create a test Express app
    app = express();
    app.use(express.json());
    app.use('/api/books', bookRoutes);
    app.use(errorMiddleware);
    
    // Stub the database connection
    await connectToDatabase();
  });

  after(() => {
    sinon.restore();
  });
  
  beforeEach(() => {
    // Reset stubs before each test
    sinon.restore();
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      // Stub the create method of BookModel
      const createStub = sinon.stub(BookModel, 'create').resolves({
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        published_date: '2023-01-01',
        genre: 'Fiction',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        is_deleted: 0
      });

      const response = await request(app)
        .post('/api/books')
        .send({
          title: 'Test Book',
          author: 'Test Author',
          published_date: '2023-01-01',
          genre: 'Fiction'
        })
        .expect(201);
      
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('id', 1);
      expect(response.body.data).to.have.property('title', 'Test Book');
      expect(createStub.calledOnce).to.be.true;
    });

    it('should return validation error for invalid input', async () => {
      const response = await request(app)
        .post('/api/books')
        .send({
          // Missing required title
          author: 'Test Author'
        })
        .expect(400);

      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('Title is required');
    });
  });

  describe('GET /api/books', () => {
    it('should get all books with pagination', async () => {
      // Stub the findAll method
      const findAllStub = sinon.stub(BookModel, 'findAll').resolves({
        books: [
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
        ],
        total: 2
      });

      const response = await request(app)
        .get('/api/books')
        .expect(200);
      
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data').with.lengthOf(2);
      expect(response.body).to.have.property('pagination');
      expect(response.body.pagination).to.have.property('total', 2);
      expect(findAllStub.calledOnce).to.be.true;
    });

    it('should filter books based on query parameters', async () => {
      // Stub the findAll method
      const findAllStub = sinon.stub(BookModel, 'findAll').resolves({
        books: [
          {
            id: 1,
            title: 'Fiction Book',
            author: 'Author 1',
            genre: 'Fiction',
            published_date: '2023-01-01',
            created_at: '2023-01-01T00:00:00.000Z',
            updated_at: '2023-01-01T00:00:00.000Z',
            is_deleted: 0
          }
        ],
        total: 1
      });

      const response = await request(app)
        .get('/api/books?genre=Fiction&page=1&limit=10')
        .expect(200);
      
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data').with.lengthOf(1);
      expect(findAllStub.calledOnce).to.be.true;
      
      // Check that filters were passed correctly
      const filterArg = findAllStub.getCall(0).args[0];
      expect(filterArg).to.have.property('genre', 'Fiction');
      expect(filterArg).to.have.property('page', 1);
      expect(filterArg).to.have.property('limit', 10);
    });
  });

  describe('GET /api/books/:id', () => {
    it('should get a single book by id', async () => {
      // Stub the findById method
      const findByIdStub = sinon.stub(BookModel, 'findById').resolves({
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        published_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
        is_deleted: 0
      });

      const response = await request(app)
        .get('/api/books/1')
        .expect(200);
      
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('id', 1);
      expect(response.body.data).to.have.property('title', 'Test Book');
      expect(findByIdStub.calledWith(1)).to.be.true;
    });

    it('should return 404 for non-existent book', async () => {
      // Stub the findById method to return null
      const findByIdStub = sinon.stub(BookModel, 'findById').resolves(null);

      const response = await request(app)
        .get('/api/books/999')
        .expect(404);
      
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('not found');
      expect(findByIdStub.calledWith(999)).to.be.true;
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update a book', async () => {
      // Stub the update method
      const updateStub = sinon.stub(BookModel, 'update').resolves({
        id: 1,
        title: 'Updated Book',
        author: 'Test Author',
        genre: 'Fiction',
        published_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-02T00:00:00.000Z',
        is_deleted: 0
      });

      const response = await request(app)
        .put('/api/books/1')
        .send({
          title: 'Updated Book',
          author: 'Test Author',
          genre: 'Fiction',
          published_date: '2023-01-01'
        })
        .expect(200);
      
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.property('title', 'Updated Book');
      expect(updateStub.calledOnce).to.be.true;
    });

    it('should return 404 for non-existent book', async () => {
      // Stub the update method to return null
      const updateStub = sinon.stub(BookModel, 'update').resolves(null);

      const response = await request(app)
        .put('/api/books/999')
        .send({
          title: 'Updated Book',
          author: 'Test Author'
        })
        .expect(404);
      
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('not found');
      expect(updateStub.calledWith(999)).to.be.true;
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      // Stub the delete method
      const deleteStub = sinon.stub(BookModel, 'delete').resolves(true);

      const response = await request(app)
        .delete('/api/books/1')
        .expect(200);
      
      expect(response.body).to.have.property('success', true);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('successfully deleted');
      expect(deleteStub.calledWith(1)).to.be.true;
    });

    it('should return 404 for non-existent book', async () => {
      // Stub the delete method to return false
      const deleteStub = sinon.stub(BookModel, 'delete').resolves(false);

      const response = await request(app)
        .delete('/api/books/999')
        .expect(404);
      
      expect(response.body).to.have.property('success', false);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.include('not found');
      expect(deleteStub.calledWith(999)).to.be.true;
    });
  });
});