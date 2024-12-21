import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema';

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = globalForDb.db ?? drizzle(pool, { schema });

// Prepare queries
export const queries = {
  teams: {
    findMany: db.query.teams.findMany,
    findFirst: db.query.teams.findFirst,
    // Add other query methods as needed
  },
  applications: {
    findMany: db.query.applications.findMany,
    findFirst: db.query.applications.findFirst,
    // Add other query methods as needed
  }
  notifications: {
    findMany: db.query.notifications.findMany,
    findFirst: db.query.notifications.findFirst,
  }
};

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
