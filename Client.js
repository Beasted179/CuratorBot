import pkg from 'pg';
const { Pool } = pkg;

import { config } from 'dotenv';
config();

const databaseUrl = process.env.DATABASE_URL;

const dbClient = new Pool({
  connectionString: databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  ssl: true, // Enable SSL/TLS encryption
});

export { dbClient };




