const sqlite3 = require('sqlite3').verbose();

function connectToDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./src/db/tasks.db', (err) => {
            if (err) {
                console.error('Error connecting to the database:', err.message);
                reject(err);
            } else {
                console.log('Connected to the tasks database.');
                resolve(db);
            }
        });
    });
}

function runQuery(db, query) {
    return new Promise((resolve, reject) => {
        db.run(query, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

function allQuery(db, query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function createTasksTable(db) {
    try {
        await runQuery(db, `
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                done BOOLEAN NOT NULL DEFAULT 0
            )
        `);
        console.log('Tasks table ready.');
    } catch (err) {
        console.error('Error creating tasks table:', err.message);
    }
}

async function insertSampleTasks(db) {
    try {
        await runQuery(db, `
            INSERT OR IGNORE INTO tasks (id, title, done)
            VALUES
                (1, 'Task 1', 0),
                (2, 'Task 2', 1),
                (3, 'Task 3', 0)
        `);
        console.log('Sample tasks inserted successfully.');
    } catch (err) {
        console.error('Error inserting sample tasks:', err.message);
    }
}

async function CloseDatabase(db) {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                console.error('Error closing the database:', err.message);
                reject(err);
            } else {
                console.log('Database connection closed.');
                resolve();
            }
        });
    });
}

async function getAllTasks(db) {
    try {
        return await allQuery(db, `SELECT * FROM tasks`);
    } catch (err) {
        console.error('Error retrieving tasks:', err.message);
        throw err;
    }
}

async function getTaskById(db, id) {
    try {
        const rows = await allQuery(db, `SELECT * FROM tasks WHERE id = ${id}`);
        return rows[0];
    } catch (err) {
        console.error('Task not found:', err.message);
        throw err;
    }
}

async function initializeDatabase() {
    const db = await connectToDatabase();
    await createTasksTable(db);
    await insertSampleTasks(db);
    await CloseDatabase(db);
}

// initializeDatabase().catch((err) => {
//     console.error('Database initialization failed:', err.message);
// });

module.exports = {
    connectToDatabase,
    createTasksTable,
    insertSampleTasks,
    CloseDatabase,
    initializeDatabase,
    getAllTasks,
    getTaskById
};