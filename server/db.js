const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'atelie.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const initDb = () => {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'user', -- 'admin' or 'user'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY, -- Custom ID like 'MFM10531'
            name TEXT,
            price REAL,
            category TEXT,
            description TEXT,
            is_highlight BOOLEAN DEFAULT 0, -- Destaque
            is_promotion BOOLEAN DEFAULT 0, -- Promoção
            image_url TEXT,
            details TEXT, -- JSON or text for dimensions/time
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Orders/Cart (Simplified)
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            status TEXT DEFAULT 'pending',
            total REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Feedback
        db.run(`CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            message TEXT,
            cashback_awarded REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);
    });
};

module.exports = { db, initDb };
