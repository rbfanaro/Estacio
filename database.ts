import * as SQLite from "expo-sqlite";

export const database = SQLite.openDatabaseSync("stock.db");

export async function createTables() {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER,
      quantity INTEGER NOT NULL DEFAULT 0,
      location TEXT,
      description TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('IN', 'OUT')),
      quantity INTEGER NOT NULL,
      date TEXT DEFAULT (datetime('now', 'localtime')),
      note TEXT,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);
}
