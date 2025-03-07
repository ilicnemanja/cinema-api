import { config } from 'dotenv';

config();

const configuration = {
  database: {
    dbUsername: process.env.DB_USERNAME || 'admin',
    dbPassword: process.env.DB_PASSWORD || '1234',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 3306,
    dbName: process.env.DB_NAME || 'cinema',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
  },
};

export default configuration;
