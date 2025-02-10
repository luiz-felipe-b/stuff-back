import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: "./src/db/schemas.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://docker:docker@localhost:5432/stuff",
    },
    migrations: {
        table: "drizzle_migrations",
        schema: "public",
    }
});
