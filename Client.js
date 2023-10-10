import pkg from 'pg';
const { Pool } = pkg;

import { config } from 'dotenv';
config();

const databaseUrl = process.env.DATABASE_URL;

const dbClient = new Pool({
  connectionString: databaseUrl,
  max: 20,
  acquireConnectionTimeout: 300000,
  ssl: true, // Enable SSL/TLS encryption
});

export { dbClient };




