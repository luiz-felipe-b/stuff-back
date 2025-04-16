import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../../../../env.ts';

export async function swaggerAuth(request: FastifyRequest, reply: FastifyReply) {
    // Obter credenciais dos cabeçalhos da requisição
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        // Sem cabeçalho de autenticação ou não é autenticação Basic
        return reply
            .status(401)
            .header('WWW-Authenticate', 'Basic realm="Swagger Documentation"')
            .send({ error: 'Authentication required' });
    }
    
    // Extrair credenciais do cabeçalho de autenticação Basic
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    // Verificar credenciais contra variáveis de ambiente
    if (
        username !== env.SWAGGER_USERNAME || 
        password !== env.SWAGGER_PASSWORD
    ) {
        return reply
            .status(401)
            .header('WWW-Authenticate', 'Basic realm="Swagger Documentation"')
            .send({ error: 'Invalid credentials' });
    }
    
    // Autenticação bem-sucedida
    return;
}