export const env = {
    PORT: parseInt(process.env.PORT || '3001', 10),
    PG_HOST: process.env.PG_HOST || 'localhost',
    PG_PORT: parseInt(process.env.PG_PORT || '5432', 10),
    PG_DB: process.env.PG_DB || 'jubelio',
    PG_USER: process.env.PG_USER || 'admin',
    PG_PASSWORD: process.env.PG_PASSWORD || 'admin',
    JWT_SECRET: process.env.JWT_SECRET || 'devsecret',
    BASIC_USER: process.env.BASIC_USER || 'admin@demo.local',
    BASIC_PASS: process.env.BASIC_PASS || 'admin123',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};