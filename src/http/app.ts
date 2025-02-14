import fastify from 'fastify';
import { registerRoutes } from './routes.js';
import { appSetup } from './app-setup.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { FastifyTypedInstance } from '../types/fastify-typed-instance.js';

const app: FastifyTypedInstance = fastify().withTypeProvider<ZodTypeProvider>() as FastifyTypedInstance;

await appSetup(app);

export default app;
