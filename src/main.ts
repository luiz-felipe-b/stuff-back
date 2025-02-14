import Fastify from 'fastify';
import { db } from './shared/db/drizzle';
import { env } from './env';

async function main() {
    const app = Fastify();

    app.get('/', async () => {
        return { message: 'Hello, Fastify!' };
    });

    try {
        await app.listen({ port: Number(env.PORT) });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
