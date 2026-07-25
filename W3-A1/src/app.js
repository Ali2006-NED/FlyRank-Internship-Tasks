// Express application configuration and API route definitions.
// This file exposes the CRUD task endpoints and serves the OpenAPI documentation.

const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { connectToDatabase, createTasksTable, insertSampleTasks, CloseDatabase, getAllTasks,initializeDatabase } = require('./db/db');

const app = express();
app.disable('x-powered-by');

initializeDatabase();

// // Middleware setup.
app.use(express.json());

// Simple smoke-test endpoint.
app.get('/', (req, res) => {
  res.send({ message: 'Hello, World!' });
});


module.exports = app;