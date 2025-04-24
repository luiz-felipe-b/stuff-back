import { z } from 'zod';

/**
 * Standard error response schema
 */
export const ErrorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string()
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Standard success response schema
 */
export const SuccessResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional()
});

export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

/**
 * Common HTTP status codes for documentation
 */
export const commonErrorResponses = {
  400: ErrorResponseSchema.extend({
    statusCode: z.number().optional().default(400),
    error: z.string().optional().default('Bad Request')
  }).describe('Bad Request'),
  401: ErrorResponseSchema.extend({
    statusCode: z.number().optional().default(401),
    error: z.string ().optional().default('Unauthorized')
  }).describe('Unauthorized'),
  403: ErrorResponseSchema.extend({
    statusCode: z.number().optional().default(403),
    error: z.string().optional().default('Forbidden')
  }).describe('Forbidden'),
  404: ErrorResponseSchema.extend({
    statusCode: z.number().optional().default(404),
    error: z.string().optional().default('Not Found')
  }).describe('Not Found'),
  409: ErrorResponseSchema.extend({
    statusCode: z.number().optional().default(409),
    error: z.string().optional().default('Conflict')
  }).describe('Conflict'),
  500: ErrorResponseSchema.extend({
    statusCode: z.number().optional().default(500),
    error: z.string().optional().default('Internal Server Error')
  }).describe('Internal Server Error'),
};

export const commonSuccessResponses = {
  200: SuccessResponseSchema.extend({
    statusCode: z.number().optional().default(200),
    message: z.string().optional().default('OK')
  }).describe('OK'),
  201: SuccessResponseSchema.extend({
    statusCode: z.number().optional().default(201),
    message: z.string().optional().default('Created')
  }).describe('Created'),
  202: SuccessResponseSchema.extend({
    statusCode: z.number().optional().default(202),
    message: z.string().optional().default('Accepted')
  }).describe('Accepted'),
  204: SuccessResponseSchema.extend({
    statusCode: z.number().optional().default(204),
    message: z.string().optional().default('No Content')
  }).describe('No Content'),
};

/**
 * Authentication token response
 */
export const TokenResponseSchema = z.object({
  accessToken: z.string()
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;