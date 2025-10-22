import { env } from './env';

// Feature flag configuration
export const features = {
    requireAuth: env.REQUIRE_AUTH === 'true', // default true, set REQUIRE_AUTH=false to disable
    // Add more flags here as needed
};
