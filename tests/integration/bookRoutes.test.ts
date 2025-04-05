// Integration test for the routes and API flow



// import request from 'supertest';
// import app from '../../src/index'; // Import the Express app

// describe('Book Routes Integration Tests', () => {
//     it('should create and retrieve a book', async () => {
//         // POST request to add a book
//         const postResponse = await request(app)
//             .post('/books')
//             .send({ title: 'Integration Test Book', author: 'Author' });

//         expect(postResponse.status).toBe(201);
//         expect(postResponse.body).toEqual(expect.objectContaining({
//             title: 'Integration Test Book',
//             author: 'Author'
//         }));

//         // GET request to retrieve all books
//         const getResponse = await request(app).get('/books');
//         expect(getResponse.status).toBe(200);
//         expect(getResponse.body).toEqual(
//             expect.arrayContaining([
//                 expect.objectContaining({ title: 'Integration Test Book' })
//             ])
//         );
//     });
// });
