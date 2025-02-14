import initSqlJs from 'sql.js';
import bcrypt from 'bcryptjs';

let db;

export async function initializeDatabase() {
  const SQL = await initSqlJs();
  db = new SQL.Database();
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      fullName TEXT NOT NULL,
      gender TEXT CHECK(gender IN ('male', 'female', 'other')) NOT NULL,
      dateOfBirth TEXT NOT NULL,
      country TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export function createUser(userData) {
  const { username, password, email, fullName, gender, dateOfBirth, country } = userData;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare(`
      INSERT INTO users (username, password, email, fullName, gender, dateOfBirth, country)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([username, hashedPassword, email, fullName, gender, dateOfBirth, country]);
    stmt.free();
    
    return { lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0].values[0][0] };
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Username or email already exists');
    }
    throw error;
  }
}

export function findUserByUsername(username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const result = stmt.getAsObject([username]);
  stmt.free();
  return Object.keys(result).length > 0 ? result : null;
}

export function findUserByEmail(email) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const result = stmt.getAsObject([email]);
  stmt.free();
  return Object.keys(result).length > 0 ? result : null;
}

export function searchUsers(query) {
  const stmt = db.prepare(`
    SELECT id, username, email, fullName, gender, dateOfBirth, country, createdAt
    FROM users 
    WHERE username LIKE ? OR email LIKE ?
  `);
  
  const searchPattern = `%${query}%`;
  const results = [];
  
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row);
  }
  stmt.free();
  
  return results;
}