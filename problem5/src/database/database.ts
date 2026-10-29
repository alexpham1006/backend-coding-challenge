import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const dataDirectory = join(process.cwd(), 'data');
const databasePath = process.env.DATABASE_PATH ?? join(dataDirectory, 'app.db');

if (databasePath !== ':memory:') {
    mkdirSync(dataDirectory, { recursive: true });
}

export const db = new DatabaseSync(databasePath);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL COLLATE NOCASE UNIQUE,
        status TEXT NOT NULL DEFAULT 'active'
            CHECK (status IN ('active', 'inactive')),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`);
