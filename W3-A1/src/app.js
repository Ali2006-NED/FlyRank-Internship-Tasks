// Express application configuration and API route definitions.
// This file exposes the CRUD task endpoints and serves the OpenAPI documentation.

const express = require('express');
const swaggerUi = require('swagger-ui-express');

const { connectToDatabase, createTasksTable, insertSampleTasks, CloseDatabase, getAllTasks,initializeDatabase,getTaskById, insertTask } = require('./db/db');

const app = express();
app.disable('x-powered-by');

initializeDatabase();

// // Middleware setup.
app.use(express.json());

// Simple smoke-test endpoint.
app.get('/', (req, res) => {
  res.send({ message: 'Hello, World!' });
});

// Retrieve all tasks.
app.get('/tasks', async (req, res) => {
    const db = await connectToDatabase();
    try {
        const tasks = await getAllTasks(db);
        res.send({ tasks });
    } catch (err) {
        res.status(500).send({ error: 'Unable to retrieve tasks:' + err.message });
    } finally {
        await CloseDatabase(db);
    }
});

// Retrieve a single task by its identifier.
app.get('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const db = await connectToDatabase();
  const task = await getTaskById(db, id);
  if (task) {
    res.send({ 'task': task });
  } else {
    res.status(404).send({ error: 'Task not found' });
  }
  await CloseDatabase(db);
  
});

// Create a new task.
app.post('/tasks', async (req, res) => {
  const title = req.body.title;
  const db = await connectToDatabase();
  if (title != null) {
    await insertTask(db, title);
    res.status(201).send({ message: 'Task created successfully' });
  } else {
    res.status(400).send({ error: 'Title is required' });
  }
  await CloseDatabase(db);
});


module.exports = app;