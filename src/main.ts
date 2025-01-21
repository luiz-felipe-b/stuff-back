import Fastify from 'fastify';
import { db } from './shared/database';

async function main() {
    const app = Fastify();

    app.get('/', async () => {
        return { message: 'Hello, Fastify!' };
    });

    try {
        await app.listen({ port: 3000 });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
