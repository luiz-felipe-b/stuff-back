import { env } from '../env.js';
import app from './app.js';

app.get('/', async (request, reply) => {
    return 'Hello Stuff!';
});

app.listen({
    port: env.PORT,
    host: '0.0.0.0'
}).then(() => {
    console.log('🐕 Server is listening!');
});
