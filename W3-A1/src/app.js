// Express application configuration and API route definitions.
// This file exposes the CRUD task endpoints and serves the OpenAPI documentation.

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapiDocument = require('./openapi.json');

const { connectToDatabase, createTasksTable, 
  insertSampleTasks, CloseDatabase, 
  getAllTasks,initializeDatabase,
  getTaskById, insertTask,
updateTask, deleteTask, getTaskStats } = require('./db/db');

const app = express();
app.disable('x-powered-by');

initializeDatabase();

// // Middleware setup.
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

// Simple smoke-test endpoint.
app.get('/', (req, res) => {
  res.send({ message: 'Hello, World!' });
});

// Retrieve all tasks.
app.get('/tasks', async (req, res) => {
    const db = await connectToDatabase();
    const tasks = await getAllTasks(db);
    if (tasks) {
      res.status(200).send({ 'tasks':tasks });
    } else {
      res.status(404).send( {error: "Tasks Not found"})
    await CloseDatabase(db);
}});

// Retrieve a single task by its identifier.
app.get('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const db = await connectToDatabase();
  const task = await getTaskById(db, id);
  if (task) {
    res.status(201).send({ 'task': task });
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

// Update a task's title and completion status.
app.put('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const done = req.body.done;
  const db = await connectToDatabase();
  const task = await getTaskById(db, id);

  if (task != []) {
    if (title.trim() != '') {
      await updateTask(db, id, title, done);
      res.status(200).send({ message: `Task ${id} updated successfully` });
    } else {
      res.status(400).send({ error: 'Title is required' });
    } 
} else {
  res.status(404).send({ error: `Task ${id} not found` });
}
await CloseDatabase(db);


});

// Delete a task by identifier.
app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const db = await connectToDatabase();
  const task = await getTaskById(db, id);
  if (task) {
    await deleteTask(db, id);
    res.status(200).send({ message: `Task ${id} deleted successfully` });
  } else {
    res.status(404).send({ error: `Task ${id} not found` });
  }
  await CloseDatabase(db);
});


app.get('/stats', async (req, res) => {
  const db = await connectToDatabase();
  const stats = await getTaskStats(db);
  if (stats) {
    res.status(200).send({ stats });
  } else {
    res.status(404).send({ error: 'Task stats not found' });
  }
  await CloseDatabase(db);
});


module.exports = app;