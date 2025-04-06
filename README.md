# Book-Catalog-REST-API
A RESTful API for managing a catalog of books with full CRUD capabilities, built with Node.js, Express, TypeScript, and SQLite.

## Features

- **RESTful API Design**: Follows REST principles with appropriate HTTP methods and status codes
- **Full CRUD Operations**: Create, Read, Update, and Delete operations for books
- **Validation**: Input validation for all API endpoints
- **Error Handling**: Comprehensive error handling with appropriate status codes
- **Pagination**: Support for paginating book lists
- **Filtering**: Filter books by title, author, or genre
- **Logging**: Detailed logging for debugging and monitoring
- **Testing**: Unit and integration tests
- **SQLite Database**: Lightweight database for easy setup
- **Soft Delete**: Books are soft deleted by default, preserving data integrity

## Project Structure

```
book-api/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/           # Data models and database interactions
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   └── index.ts          # Application entry point
├── tests/
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── .env                  # Environment variables (not committed)
├── .env.example          # Example environment variables
└── package.json          # Project metadata and dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/book-api.git
   cd book-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your desired configuration.

4. Build the TypeScript code:
   ```bash
   npm run build
   ```

## Running the API

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon, which will automatically restart when you make changes.

### Production Mode

```bash
npm run build
npm start
```

## API Endpoints

### Books

| Method | Endpoint         | Description                                     |
|--------|------------------|-------------------------------------------------|
| GET    | /api/books       | Get all books (with optional filtering)         |
| GET    | /api/books/:id   | Get a single book by ID                         |
| POST   | /api/books       | Create a new book                               |
| PUT    | /api/books/:id   | Update a book                                   |
| DELETE | /api/books/:id   | Delete a book (soft delete)                     |

### Query Parameters for GET /api/books

- `title`: Filter by book title (partial match)
- `author`: Filter by author name (partial match)
- `genre`: Filter by genre (partial match)
- `page`: Page number for pagination (default: 1)
- `limit`: Number of items per page (default: 10)

## Testing

### Running All Tests

```bash
npm test
```

### Running Unit Tests Only

```bash
npm run test:unit
```

### Running Integration Tests Only

```bash
npm run test:integration
```

## Book Model

A book has the following properties:

- `id`: Unique identifier (auto-generated)
- `title`: Book title (required)
- `author`: Author name (required)
- `published_date`: Publication date (optional, format: YYYY-MM-DD)
- `genre`: Book genre (optional)
- `created_at`: Timestamp of creation (auto-generated)
- `updated_at`: Timestamp of last update (auto-generated)
- `is_deleted`: Soft delete flag (default: 0)

## Future Enhancements

- Authentication: JWT-based authentication to secure API endpoints
Rate Limiting: Implement protection against abuse through rate limiting
Docker Support: Containerization for easy deployment and development
Search Functionality: Full-text search capabilities for books
User Roles: Admin and regular user roles with different permissions
API Documentation: Interactive Swagger/OpenAPI documentation
Caching: Response caching to improve performance
Metrics: Monitoring and performance metrics collection

Deployment
The API can be deployed to various cloud providers:

Heroku: Simple deployment with Procfile
AWS: Deploy using Elastic Beanstalk or EC2
Digital Ocean: Deploy using App Platform
Google Cloud: Deploy using Cloud Run or App Engine

For production environments, consider using a more robust database like PostgreSQL or MySQL instead of SQLite.
Error Handling
The API uses a consistent error response format:
jsonCopy{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}  // Optional additional details
  }
}
Common HTTP status codes:

200: Successful request
201: Resource created successfully
400: Bad request (invalid input)
404: Resource not found
500: Server error

Logging
Logs are stored in the /logs directory with different levels:

error.log: Critical errors requiring attention
info.log: General information about API operation
access.log: HTTP request and response details

Contributing

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

NETGEAR for the engaging technical challenge
Express.js community for the excellent framework
TypeScript team for the type safety

Contact
Project Link: https://github.com/your-username/book-api
This project was created as part of the NETGEAR Cloud Systems Technical Assessment.
