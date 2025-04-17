import { z } from 'zod';

/**
 * Standard error response schema
 */
export const ErrorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string()
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Standard success response schema
 */
export const SuccessResponseSchema = z.object({
  success: z.boolean(),
  message: z.string()
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

/**
 * Common HTTP status codes for documentation
 */
export const commonErrorResponses = {
  400: ErrorResponseSchema,
  401: ErrorResponseSchema,
  403: ErrorResponseSchema,
  404: ErrorResponseSchema,
  409: ErrorResponseSchema,
  500: ErrorResponseSchema
};

/**
 * Authentication token response
 */
export const TokenResponseSchema = z.object({
  accessToken: z.string()
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;