// Main application file

import express from 'express';
import cors from 'cors';
import helmet from 'helmet'; // used for security headers

import { config } from './config/env';
import { connectToDatabase } from './config/db';
import bookRoutes from './routes/bookRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import logger from './utils/logger'; 

// Initialize express app
const app = express();

const PORT = config.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // cross origin resource sharing
app.use(express.json()); // makes use of the express middelware to parse the json between the request and response 
app.use(express.urlencoded({ extended: true }));


// app.get('/', (req, res) => {
//   res.send('Welcome to the NetGear Book API! Please use the /api/books endpoint to access the API.');
// });

// Routes
app.use('/api/books', bookRoutes);

// Error handling middleware (should be last)
app.use(errorMiddleware);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectToDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();