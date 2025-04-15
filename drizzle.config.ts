import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
    schema: "src/db/schemas/index.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    migrations: {
        table: "drizzle_migrations",
        schema: "public",
    }
});
