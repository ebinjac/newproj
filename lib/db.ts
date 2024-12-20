import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../drizzle/schema';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { drizzle as drizzleCore } from 'drizzle-orm';

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzleCore> | undefined;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = globalForDb.db ?? drizzle(pool, { schema });

// Prepare queries
export const queries = {
  teams: db.query.teams,
  applications: db.query.applications,
};

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
