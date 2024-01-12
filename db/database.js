const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/app.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite db.');
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, username TEXT UNIQUE, password TEXT, email TEXT, phone TEXT, isAdmin INTEGER)");
  db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL)");
});

module.exports = db;
