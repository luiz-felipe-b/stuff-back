import fastify from 'fastify';
import { registerRoutes } from './routes.js';
import { appSetup } from './app-setup.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

const app = fastify().withTypeProvider<ZodTypeProvider>();

await appSetup(app);

await registerRoutes(app);

export default app;
