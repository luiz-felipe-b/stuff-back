import { z } from 'zod';
import { UserSchema } from '../user.schema.js';
import { ErrorResponseSchema, SuccessResponseSchema, commonErrorResponses } from '../../../../../types/http/responses.js';

// Extract public user fields (omit sensitive data)
const PublicUserSchema = UserSchema.omit({ 
  password: true,
});

// Array of users response
const UsersArraySchema = z.array(PublicUserSchema);

// Create user request body
const CreateUserSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'moderator', 'user']).optional().default('user'),
  tier: z.enum(['free', 'plus', 'pro', 'enterprise']).optional().default('free'),
  organizationId: z.string().optional().nullable()
});

// Update user request body
const UpdateUserSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'moderator', 'user']).optional(),
  tier: z.enum(['free', 'plus', 'pro', 'enterprise']).optional(),
  active: z.boolean().optional(),
  authenticated: z.boolean().optional(),
  organizationId: z.string().optional().nullable()
});

// Update password request body
const UpdatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8)
});

// User parameters
const UserIdParam = z.object({
  id: z.string()
});

// Export route documentation
export const userRouteDocs = {
  getAllUsers: {
    description: 'Get all users',
    tags: ['user'],
    response: {
      200: UsersArraySchema,
      401: ErrorResponseSchema,
      500: ErrorResponseSchema
    },
    security: [{ bearerAuth: [] }]
  },

  getUserByEmail: {
    description: 'Get current authenticated user',
    tags: ['user'],
    response: {
      200: PublicUserSchema,
      ...commonErrorResponses
    },
    security: [{ bearerAuth: [] }]
  },

  getUserById: {
    description: 'Get user by ID',
    tags: ['user'],
    params: UserIdParam,
    response: {
      200: PublicUserSchema,
      ...commonErrorResponses
    },
    security: [{ bearerAuth: [] }]
  },

  createUser: {
    description: 'Create a new user',
    tags: ['user'],
    body: CreateUserSchema,
    response: {
      201: PublicUserSchema,
      ...commonErrorResponses
    }
  },

  updateUser: {
    description: 'Update a user by ID',
    tags: ['user'],
    params: UserIdParam,
    body: UpdateUserSchema,
    response: {
      200: PublicUserSchema,
      ...commonErrorResponses
    },
    security: [{ bearerAuth: [] }]
  },

  updateMe: {
    description: 'Update current authenticated user',
    tags: ['user'],
    body: UpdateUserSchema,
    response: {
      200: PublicUserSchema,
      ...commonErrorResponses
    },
    security: [{ bearerAuth: [] }]
  },

  updateMePassword: {
    description: 'Update current authenticated user password',
    tags: ['user'],
    body: UpdatePasswordSchema,
    response: {
      200: SuccessResponseSchema,
      ...commonErrorResponses
    },
    security: [{ bearerAuth: [] }]
  },

  deleteUser: {
    description: 'Delete a user by ID',
    tags: ['user'],
    params: UserIdParam,
    response: {
      200: SuccessResponseSchema,
      ...commonErrorResponses
    },
    security: [{ bearerAuth: [] }]
  }
};