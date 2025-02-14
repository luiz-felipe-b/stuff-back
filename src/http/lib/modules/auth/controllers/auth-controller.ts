import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth-service.js";
import { Controller } from "../../../common/controllers/controller.js";

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

    async protected(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(req, reply, async () => {
            reply.send({ success: true, message: 'Access granted!' });
            return reply;
        });
    }

    async refresh(req: FastifyRequest, reply: FastifyReply): Promise<void> {
        return this.handleRequest(req, reply, async () => {
            const accessToken = await this.authService.refresh(req);
            reply.status(200).send({ accessToken });
            return reply;
        });
    }
}
