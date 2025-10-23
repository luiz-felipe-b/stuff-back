import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service.ts";
import { Controller } from "../../common/controllers/controller.ts";
import { SuccessResponse, TokenResponse } from "../../../../types/http/responses.ts";

export class AuthController extends Controller {
    private authService: AuthService;

    constructor(authService: AuthService) {
        super();
        this.authService = authService;
    }

    async login(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            const tokens = await this.authService.login(req);
            reply
                .setCookie('refreshToken', tokens.refreshToken, {
                    httpOnly: true,
                    secure: true, // Use true in production, false in dev
                    sameSite: 'none',
                    path: '/'
                })
                .send({ accessToken: tokens.accessToken });
            return reply;
        });
    }

    async logout(req: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        return this.handleRequest(req, reply, async () => {
            await this.authService.logout(req);
            reply.clearCookie('refreshToken', { path: '/' }).send({ message:'Succesfully logged out.', success: true });
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
            console.log(req.cookies);
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
