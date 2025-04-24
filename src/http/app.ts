import fastify from 'fastify';
import { registerRoutes } from './routes.js';
import { appSetup } from './app-setup.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyTypedInstance } from '../types/fastify-typed-instance.js';

const app = fastify({logger: true}).withTypeProvider<ZodTypeProvider>();

async function start(app: FastifyTypedInstance) {
    await appSetup(app);
    
    await registerRoutes(app);
}

export default app;
