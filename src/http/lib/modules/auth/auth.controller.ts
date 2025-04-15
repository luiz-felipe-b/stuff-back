import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service.ts";
import { Controller } from "../../common/controllers/controller.ts";

export class AuthController extends Controller {
    private authService: AuthService;

    constructor(authService: AuthService) {
        super();
        this.authService = authService;
    }

    async login(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(req, reply, async () => {
            const tokens = await this.authService.login(req);
            reply
                .setCookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/'
                })
                .send({ accessToken: tokens.accessToken });
            return reply;
        });
    }

    async logout(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(req, reply, async () => {
            await this.authService.logout(req);
            reply.clearCookie('refreshToken', { path: '/' }).send({ success: true });
            return reply;
        });
    }

    async forgotPassword(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(req, reply, async () => {
            await this.authService.forgotPassword(req);
            reply.send({ success: true, message: 'Password reset link sent to your email.' });
            return reply;
        });
    }

    async resetPassword(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(req, reply, async () => {
            await this.authService.resetPassword(req);
            reply.send({ success: true, message: 'Password reset successfully.' });
            return reply;
        });
    }

    async refreshToken(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(req, reply, async () => {
            const tokens = await this.authService.refreshToken(req);
            reply.send({ accessToken: tokens.accessToken });
            return reply;
        });
    }

    async protected(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(req, reply, async () => {
            reply.send({ success: true, message: 'Access granted!' });
            return reply;
        });
    }
}
