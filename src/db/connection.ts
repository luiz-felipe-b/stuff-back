import { drizzle as dbConnect } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import { env } from '../env';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export const db = dbConnect({ client: pool });
