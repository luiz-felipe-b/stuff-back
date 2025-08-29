// Feature flag configuration
export const features = {
    requireAuth: process.env.REQUIRE_AUTH !== 'false', // default true, set REQUIRE_AUTH=false to disable
    // Add more flags here as needed
};
