import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.string().default('3000').transform(Number),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    JWT_SECRET: z.string(),
    SWAGGER_URL: z.string().default('/api-docs'),
    REFRESH_TOKEN_EXPIRATION: z.string().default('7d'),
    ACCESS_TOKEN_EXPIRATION: z.string().default('15m'),
    BREVO_API_KEY: z.string(),
    SWAGGER_USERNAME: z.string(),
    SWAGGER_PASSWORD: z.string()
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    const errorFormat = _env.error.format();
    const errorMessages = Object.entries(errorFormat)
        .filter(([key]) => key !== '_errors')
        .map(([key, value]) => {
            const errors = (value as any)._errors.join(', ');
            return `${key}: ${errors}`;
        })
        .join('\n');
    
    console.error(`❌ Variáveis de ambiente inválidas:\n${errorMessages}`);
    throw new Error(`Variáveis de ambiente inválidas:\n${errorMessages}`);
}

export const env = _env.data;
