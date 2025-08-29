import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../../../../env.ts';

export async function swaggerAuth(request: FastifyRequest, reply: FastifyReply) {
    // Only require authentication if not in development
    if (env.NODE_ENV === 'development') {
        return;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return reply
            .status(401)
            .header('WWW-Authenticate', 'Basic realm="Swagger Documentation"')
            .send({ error: 'Authentication required' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (
        username !== env.SWAGGER_USERNAME || 
        password !== env.SWAGGER_PASSWORD
    ) {
        return reply
            .status(401)
            .header('WWW-Authenticate', 'Basic realm="Swagger Documentation"')
            .send({ error: 'Invalid credentials' });
    }

    // Auth success
    return;
}