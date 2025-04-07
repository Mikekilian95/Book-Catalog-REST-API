"use strict";
// THis test can test the end-to-end function of the API
// This test can test the API with the database
// This file is designed to test the API with the database
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
const supertest_1 = __importDefault(require("supertest")); // use supertest for HTTP assertions
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const express_1 = __importDefault(require("express"));
const db_1 = require("../../src/config/db");
const bookRoutes_1 = __importDefault(require("../../src/routes/bookRoutes"));
const errorMiddleware_1 = require("../../src/middleware/errorMiddleware");
const book_1 = __importDefault(require("../../src/models/book"));
describe('Book API Integration Tests', () => {
    let app;
    let dbStub;
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a test Express app
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/books', bookRoutes_1.default);
        app.use(errorMiddleware_1.errorMiddleware);
        // Stub the database connection
        yield (0, db_1.connectToDatabase)();
    }));
    after(() => {
        sinon_1.default.restore();
    });
    beforeEach(() => {
        // Reset stubs before each test
        sinon_1.default.restore();
    });
    describe('POST /api/books', () => {
        it('should create a new book', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the create method of BookModel
            const createStub = sinon_1.default.stub(book_1.default, 'create').resolves({
                id: 1,
                title: 'Test Book',
                author: 'Test Author',
                published_date: '2023-01-01',
                genre: 'Fiction',
                created_at: '2023-01-01T00:00:00.000Z',
                updated_at: '2023-01-01T00:00:00.000Z',
                is_deleted: 0
            });
            const response = yield (0, supertest_1.default)(app)
                .post('/api/books')
                .send({
                title: 'Test Book',
                author: 'Test Author',
                published_date: '2023-01-01',
                genre: 'Fiction'
            })
                .expect(201);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('data');
            (0, chai_1.expect)(response.body.data).to.have.property('id', 1);
            (0, chai_1.expect)(response.body.data).to.have.property('title', 'Test Book');
            (0, chai_1.expect)(createStub.calledOnce).to.be.true;
        }));
        it('should return validation error for invalid input', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/books')
                .send({
                // Missing required title
                author: 'Test Author'
            })
                .expect(400);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('message');
            (0, chai_1.expect)(response.body.message).to.include('Title is required');
        }));
    });
    describe('GET /api/books', () => {
        it('should get all books with pagination', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the findAll method
            const findAllStub = sinon_1.default.stub(book_1.default, 'findAll').resolves({
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
            const response = yield (0, supertest_1.default)(app)
                .get('/api/books')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('data').with.lengthOf(2);
            (0, chai_1.expect)(response.body).to.have.property('pagination');
            (0, chai_1.expect)(response.body.pagination).to.have.property('total', 2);
            (0, chai_1.expect)(findAllStub.calledOnce).to.be.true;
        }));
        it('should filter books based on query parameters', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the findAll method
            const findAllStub = sinon_1.default.stub(book_1.default, 'findAll').resolves({
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
            const response = yield (0, supertest_1.default)(app)
                .get('/api/books?genre=Fiction&page=1&limit=10')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('data').with.lengthOf(1);
            (0, chai_1.expect)(findAllStub.calledOnce).to.be.true;
            // Check that filters were passed correctly
            const filterArg = findAllStub.getCall(0).args[0];
            (0, chai_1.expect)(filterArg).to.have.property('genre', 'Fiction');
            (0, chai_1.expect)(filterArg).to.have.property('page', 1);
            (0, chai_1.expect)(filterArg).to.have.property('limit', 10);
        }));
    });
    describe('GET /api/books/:id', () => {
        it('should get a single book by id', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the findById method
            const findByIdStub = sinon_1.default.stub(book_1.default, 'findById').resolves({
                id: 1,
                title: 'Test Book',
                author: 'Test Author',
                genre: 'Fiction',
                published_date: '2023-01-01',
                created_at: '2023-01-01T00:00:00.000Z',
                updated_at: '2023-01-01T00:00:00.000Z',
                is_deleted: 0
            });
            const response = yield (0, supertest_1.default)(app)
                .get('/api/books/1')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('data');
            (0, chai_1.expect)(response.body.data).to.have.property('id', 1);
            (0, chai_1.expect)(response.body.data).to.have.property('title', 'Test Book');
            (0, chai_1.expect)(findByIdStub.calledWith(1)).to.be.true;
        }));
        it('should return 404 for non-existent book', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the findById method to return null
            const findByIdStub = sinon_1.default.stub(book_1.default, 'findById').resolves(null);
            const response = yield (0, supertest_1.default)(app)
                .get('/api/books/999')
                .expect(404);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('message');
            (0, chai_1.expect)(response.body.message).to.include('not found');
            (0, chai_1.expect)(findByIdStub.calledWith(999)).to.be.true;
        }));
    });
    describe('PUT /api/books/:id', () => {
        it('should update a book', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the update method
            const updateStub = sinon_1.default.stub(book_1.default, 'update').resolves({
                id: 1,
                title: 'Updated Book',
                author: 'Test Author',
                genre: 'Fiction',
                published_date: '2023-01-01',
                created_at: '2023-01-01T00:00:00.000Z',
                updated_at: '2023-01-02T00:00:00.000Z',
                is_deleted: 0
            });
            const response = yield (0, supertest_1.default)(app)
                .put('/api/books/1')
                .send({
                title: 'Updated Book',
                author: 'Test Author',
                genre: 'Fiction',
                published_date: '2023-01-01'
            })
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('data');
            (0, chai_1.expect)(response.body.data).to.have.property('title', 'Updated Book');
            (0, chai_1.expect)(updateStub.calledOnce).to.be.true;
        }));
        it('should return 404 for non-existent book', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the update method to return null
            const updateStub = sinon_1.default.stub(book_1.default, 'update').resolves(null);
            const response = yield (0, supertest_1.default)(app)
                .put('/api/books/999')
                .send({
                title: 'Updated Book',
                author: 'Test Author'
            })
                .expect(404);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('message');
            (0, chai_1.expect)(response.body.message).to.include('not found');
            (0, chai_1.expect)(updateStub.calledWith(999)).to.be.true;
        }));
    });
    describe('DELETE /api/books/:id', () => {
        it('should delete a book', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the delete method
            const deleteStub = sinon_1.default.stub(book_1.default, 'delete').resolves(true);
            const response = yield (0, supertest_1.default)(app)
                .delete('/api/books/1')
                .expect(200);
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('message');
            (0, chai_1.expect)(response.body.message).to.include('successfully deleted');
            (0, chai_1.expect)(deleteStub.calledWith(1)).to.be.true;
        }));
        it('should return 404 for non-existent book', () => __awaiter(void 0, void 0, void 0, function* () {
            // Stub the delete method to return false
            const deleteStub = sinon_1.default.stub(book_1.default, 'delete').resolves(false);
            const response = yield (0, supertest_1.default)(app)
                .delete('/api/books/999')
                .expect(404);
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('message');
            (0, chai_1.expect)(response.body.message).to.include('not found');
            (0, chai_1.expect)(deleteStub.calledWith(999)).to.be.true;
        }));
    });
});
