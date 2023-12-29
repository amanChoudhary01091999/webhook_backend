const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('example.db');

// Ensure that the "users" table exists
db.run(`
  CREATE TABLE IF NOT EXISTS bitbucket (
    ticket_id VARCHAR(30) PRIMARY KEY,
    summary VARCHAR(200),
    priority VARCHAR(20),
    assignee VARCHAR(100),
    status VARCHAR(100)
   
  )
`);

module.exports = db;