"use strict";
// This file is used to test the Book model class, testing its methods in isolation.
// Mocha and Chai testing framworks are used for testing, and Sinon is used for mocking the database interactions.
// Spies: Observe and record function behavior without altering it.
// Stubs: Replace a function's implementation with controlled behavior.
// Mocks: Combine stubbing with expectations and verifications.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const book_1 = __importDefault(require("../../src/models/book"));
const db = __importStar(require("../../src/config/db"));
// This test file is used to test the BookModel class and its methods
// It uses Sinon for mocking and Chai for assertions
// Ran npm install --save-dev chai sinon @types/sinon to install the required packages
// Also needed Jest & Mocha in the devDependencies in package.json
// npm install --save-dev jest mocha @types/jest @types/mocha ts-jest
// The 'describe' and 'beforeEach' functions were throwing errors without these packages in the devDependencies
describe('Book Model', () => {
    let mockDb;
    let getDbStub;
    const sampleBook = {
        title: 'Test Book',
        author: 'Test Author',
        published_date: '2023-01-01',
        genre: 'Test Genre'
    };
    beforeEach(() => {
        // Create mock database methods
        mockDb = {
            get: sinon_1.default.stub(),
            all: sinon_1.default.stub(),
            run: sinon_1.default.stub().resolves({ lastID: 1, changes: 1 })
        };
        // Stub the getDatabase function to return our mock
        getDbStub = sinon_1.default.stub(db, 'getDatabase').returns(mockDb);
    });
    afterEach(() => {
        // Restore all stubs
        sinon_1.default.restore();
    });
    describe('create', () => {
        it('should create a new book', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup the stubs to return expected values
            mockDb.get.resolves(Object.assign(Object.assign({ id: 1 }, sampleBook), { created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z', is_deleted: 0 }));
            // Call the method being tested
            const result = yield book_1.default.create(sampleBook);
            // Assertions
            (0, chai_1.expect)(mockDb.run.calledOnce).to.be.true;
            (0, chai_1.expect)(result).to.have.property('id', 1);
            (0, chai_1.expect)(result).to.have.property('title', sampleBook.title);
            (0, chai_1.expect)(result).to.have.property('author', sampleBook.author);
        }));
        it('should throw an error if database operation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup the stub to throw an error
            mockDb.run.rejects(new Error('Database error'));
            // Call the method and expect it to throw
            try {
                yield book_1.default.create(sampleBook);
                // If we get here, the test should fail
                chai_1.expect.fail('Should have thrown an error');
            }
            catch (error) {
                (0, chai_1.expect)(error).to.be.instanceOf(Error);
                (0, chai_1.expect)(error.message).to.equal('Database error');
            }
        }));
    });
    describe('findById', () => {
        it('should return a book when found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup the mock
            const expectedBook = Object.assign(Object.assign({ id: 1 }, sampleBook), { created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z', is_deleted: 0 });
            mockDb.get.resolves(expectedBook);
            // Call the method
            const result = yield book_1.default.findById(1);
            // Assertions
            (0, chai_1.expect)(mockDb.get.calledOnce).to.be.true;
            (0, chai_1.expect)(result).to.deep.equal(expectedBook);
        }));
        it('should return null when book not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup the mock to return null (book not found)
            mockDb.get.resolves(null);
            // Call the method
            const result = yield book_1.default.findById(999);
            // Assertions
            (0, chai_1.expect)(mockDb.get.calledOnce).to.be.true;
            (0, chai_1.expect)(result).to.be.null;
        }));
    });
    describe('findAll', () => {
        it('should return books with pagination info', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const result = yield book_1.default.findAll({ page: 1, limit: 10 });
            // Assertions
            (0, chai_1.expect)(mockDb.all.calledOnce).to.be.true;
            (0, chai_1.expect)(mockDb.get.calledOnce).to.be.true;
            (0, chai_1.expect)(result).to.have.property('books').with.lengthOf(2);
            (0, chai_1.expect)(result).to.have.property('total', 2);
        }));
        it('should apply filters correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            // Setup the mocks
            mockDb.all.resolves([]);
            mockDb.get.resolves({ count: 0 });
            // Call the method with filters
            yield book_1.default.findAll({
                title: 'Test',
                author: 'Author',
                genre: 'Fiction'
            });
            // Check if the first call argument (SQL query) contains the filter conditions
            const sqlQuery = mockDb.all.getCall(0).args[0];
            (0, chai_1.expect)(sqlQuery).to.include('title LIKE ?');
            (0, chai_1.expect)(sqlQuery).to.include('author LIKE ?');
            (0, chai_1.expect)(sqlQuery).to.include('genre LIKE ?');
            // Check if the parameters were passed correctly
            const params = mockDb.all.getCall(0).args[1];
            (0, chai_1.expect)(params).to.include('%Test%');
            (0, chai_1.expect)(params).to.include('%Author%');
            (0, chai_1.expect)(params).to.include('%Fiction%');
        }));
    });
    describe('update', () => {
        beforeEach(() => {
            // Setup the mock to return a book for findById
            mockDb.get.resolves(Object.assign(Object.assign({ id: 1 }, sampleBook), { created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z', is_deleted: 0 }));
        });
        it('should update a book successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Call the method
            const updateData = { title: 'Updated Title', genre: 'Updated Genre' };
            yield book_1.default.update(1, updateData);
            // Assertions
            (0, chai_1.expect)(mockDb.run.calledOnce).to.be.true;
            // Check if SQL and parameters are correct
            const sqlQuery = mockDb.run.getCall(0).args[0];
            (0, chai_1.expect)(sqlQuery).to.include('UPDATE books SET');
            (0, chai_1.expect)(sqlQuery).to.include('title = ?');
            (0, chai_1.expect)(sqlQuery).to.include('genre = ?');
            const params = mockDb.run.getCall(0).args[1];
            (0, chai_1.expect)(params).to.include('Updated Title');
            (0, chai_1.expect)(params).to.include('Updated Genre');
        }));
        it('should return null when the book is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Override the mock to return null (book not found)
            mockDb.get.resolves(null);
            // Call the method
            const result = yield book_1.default.update(999, { title: 'New Title' });
            // Assertions
            (0, chai_1.expect)(result).to.be.null;
            (0, chai_1.expect)(mockDb.run.called).to.be.false; // Run should not be called
        }));
    });
    describe('delete', () => {
        beforeEach(() => {
            // Setup the mock to return a book for findById
            mockDb.get.resolves(Object.assign(Object.assign({ id: 1 }, sampleBook), { created_at: '2023-01-01T00:00:00.000Z', updated_at: '2023-01-01T00:00:00.000Z', is_deleted: 0 }));
        });
        it('should soft delete a book successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Call the method
            const result = yield book_1.default.delete(1);
            // Assertions
            (0, chai_1.expect)(result).to.be.true;
            (0, chai_1.expect)(mockDb.run.calledOnce).to.be.true;
            // Check if SQL is correct
            const sqlQuery = mockDb.run.getCall(0).args[0];
            (0, chai_1.expect)(sqlQuery).to.include('UPDATE books SET is_deleted = 1');
        }));
        it('should return false when the book is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Override the mock to return null (book not found)
            mockDb.get.resolves(null);
            // Call the method
            const result = yield book_1.default.delete(999);
            // Assertions
            (0, chai_1.expect)(result).to.be.false;
            (0, chai_1.expect)(mockDb.run.called).to.be.false; // Run should not be called
        }));
    });
});
