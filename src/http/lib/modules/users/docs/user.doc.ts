import { z } from 'zod';
import { createUserSchema, publicUserSchema, updatePasswordSchema, updateUserSchema, userIdParamSchema } from '../user.schema';
import { commonErrorResponses, commonSuccessResponses } from '../../../../../types/http/responses';

// Export route documentation
export const userRouteDocs = {
  getAllUsers: {
    description: 'Get all users',
    tags: ['user'],
    response: {
      200: commonSuccessResponses[200].extend({
        message: z.string().default('Users found'),
        data: z.array(publicUserSchema)
      }).describe('Users found'),
      401: commonErrorResponses[401],
      500: commonErrorResponses[500],
    },
    security: [{ bearerAuth: [] }]
  },

  getUserByEmail: {
    description: 'Get user by their email',
    tags: ['user'],
    response: {
      200: commonSuccessResponses[200].extend({
        message: z.string().default('User found'),
        data: publicUserSchema
      }).describe('User found'),
      404: commonErrorResponses[404].describe('User not found'),
      400: commonErrorResponses[400].extend({error:z.string().default('Invalid email')}).describe('Invalid email'),
      500: commonErrorResponses[500],
    },
    security: [{ bearerAuth: [] }]
  },

  getUserById: {
    description: 'Get user by ID',
    tags: ['user'],
    params: userIdParamSchema,
    response: {
      200: commonSuccessResponses[200].extend({
        message: z.string().default('User found'),
        data: publicUserSchema
      }).describe('User found'),
      404: commonErrorResponses[404].describe('User not found'),
      401: commonErrorResponses[401],
      500: commonErrorResponses[500],
    },
    security: [{ bearerAuth: [] }]
  },

  createUser: {
    validationSchema: false,
    description: 'Create a new user',
    tags: ['user'],
    body: createUserSchema,
    response: {
      201: commonSuccessResponses[201].extend({
        message: z.string().default('User created'),
        data: publicUserSchema
      }).describe('User created successfully'),
      400: commonErrorResponses[400].describe('Bad Request'),
      409: commonErrorResponses[409].describe('User already exists'),
      500: commonErrorResponses[500].describe('Internal Server Error'),
    }
  },

  updateUser: {
    description: 'Update a user by ID',
    tags: ['user'],
    params: userIdParamSchema,
    body: updateUserSchema,
    response: {
      200: commonSuccessResponses[200].extend({
        message: z.string().default('User updated'),
        data: z.void()
      }).describe('User updated successfully'),
      400: commonErrorResponses[400].describe('Bad Request'),
      404: commonErrorResponses[404].describe('User not found'),
    },
  },

  getMe: {
    description: 'Get current authenticated user',
    tags: ['user'],
    response: {
      200: commonSuccessResponses[200].extend({
        message: z.string().default('User found'),
        data: publicUserSchema
      }).describe('User found'),
      400: commonErrorResponses[400].describe('Bad Request'),
      401: commonErrorResponses[401].describe('Unauthorized'),
      404: commonErrorResponses[404].describe('User not found'),
    },
  },

  updateMe: {
    description: 'Update current authenticated user',
    tags: ['user'],
    body: updateUserSchema,
    response: {
      200: commonSuccessResponses[200].extend({
        message: z.string().default('User updated'),
        data: z.void()
      }).describe('User updated successfully'),
      400: commonErrorResponses[400].describe('Bad Request'),
      401: commonErrorResponses[401].describe('Unauthorized'),
      404: commonErrorResponses[404].describe('User not found'),
    },
  },

  updateMePassword: {
    description: 'Update current authenticated user password',
    tags: ['user'],
    body: updatePasswordSchema,
    response: {
      200: commonSuccessResponses[200].extend({
        message: z.string().default('User updated'),
        data: z.void()
      }).describe('User updated successfully'),
      ...commonErrorResponses
    },
    security: [{ bearerAuth: [] }]
  },

  deleteUser: {
    description: 'Delete a user by ID',
    tags: ['user'],
    params: userIdParamSchema,
    response: {
      200: commonSuccessResponses[200].extend({
        message: z.string().default('User deleted'),
        data: z.void()
      }).describe('User was successfully deleted'),
      ...commonErrorResponses
    },
    security: [{ bearerAuth: [] }]
  }
};