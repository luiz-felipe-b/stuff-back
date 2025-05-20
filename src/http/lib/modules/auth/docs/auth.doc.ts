import { z } from 'zod';
import { ErrorResponseSchema, SuccessResponseSchema, TokenResponseSchema, commonErrorResponses } from '../../../../../types/http/responses.js';


// Forgot password request body
const ForgotPasswordSchema = z.object({
    email: z.string().email()
});

// Reset password request body
const ResetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string().min(8)
});
// Login request body
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Export route documentation
export const authRouteDocs = {
  login: {
    description: 'Login with an account',
    tags: ['auth'],
    body: LoginSchema,
    response: {
      200: TokenResponseSchema,
      ...commonErrorResponses
    },
    security: []
  },

  logout: {
    description: 'Logout from an account',
    tags: ['auth'],
    response: {
      200: SuccessResponseSchema,
      400: ErrorResponseSchema,
      401: ErrorResponseSchema,
      500: ErrorResponseSchema
    },
    security: [{ bearerAuth: [] }]
  },

  refreshToken: {
    description: 'Refresh the access token',
    tags: ['auth'],
    response: {
      200: TokenResponseSchema,
      400: ErrorResponseSchema,
      401: ErrorResponseSchema,
      404: ErrorResponseSchema,
      500: ErrorResponseSchema
    },
    security: []
  },

  forgotPassword: {
    description: 'Request a password reset',
    tags: ['auth'],
    body: ForgotPasswordSchema,
    response: {
      200: SuccessResponseSchema,
      500: ErrorResponseSchema
    },
    security: []
  },

  resetPassword: {
    description: 'Reset password using a reset password token',
    tags: ['auth'],
    body: ResetPasswordSchema,
    response: {
      200: SuccessResponseSchema,
      ...commonErrorResponses
    },
    security: []
  }
};