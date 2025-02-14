import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '../auth/services/auth-service.js';
import { UserRepository } from '../users/repositories/users-repository.js';
import { RefreshTokenRepository } from '../auth/repositories/refresh-token-repository.js';
import { z } from 'zod';

export async function insertTokenCookies(app: FastifyInstance) {
    // DEV-ONLY
    app.post('/insert-token-cookies', {
        schema: {
            description: 'Insert token into cookies',
            tags: ['debug'],
            body: z.object({
                refreshToken: z.string()
            }),
            response: {
                200: z.object({message: z.string(), refreshToken: z.string()})
            }
        },
        handler: async (req: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) => {
            try {
                const refreshTokenRepository = new RefreshTokenRepository();
                const refreshToken = await refreshTokenRepository.findRefreshToken(req.body.refreshToken);

                reply
                    .setCookie('refreshToken', refreshToken.token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        path: '/'
                    })
                    .send({ "message": "Sucessfully inserted token into cookies" , refreshToken: refreshToken.token });
            } catch (err) {
                reply.status(500).send({ error: 'Failed to insert token cookies' });
            }
        }
    });
}
