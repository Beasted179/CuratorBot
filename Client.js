import { Pool } from 'pg';
import { config } from "dotenv";
config();

const databaseUrl = process.env.DATABASE_URL;  ;


export const dbClient = new Pool({
    connectionString: databaseUrl,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
  });






