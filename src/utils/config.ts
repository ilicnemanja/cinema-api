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
};

export default configuration;
