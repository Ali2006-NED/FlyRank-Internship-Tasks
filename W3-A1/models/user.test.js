const db = require('../src/db/db.js');

describe('Database Connection', () => {
    let database;

    beforeAll(async () => {
        database = await db.connectToDatabase();
    });

    afterAll(async () => {
        await db.CloseDatabase(database);
    });

    test('should connect to the database successfully', () => {
        expect(database).toBeDefined();
    });
    
test('should create tasks table successfully', async () => {
        await db.createTasksTable(database);
        const result = await new Promise((resolve, reject) => {
            database.get("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'", (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
        expect(result).toBeDefined();
    });
});

