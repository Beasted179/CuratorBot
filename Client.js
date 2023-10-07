import pkg from 'pg';
const { Pool } = pkg;
import { config } from "dotenv";
config();

const databaseUrl = process.env.DATABASE_URL;  ;


 const dbClient = new Pool({
    connectionString: databaseUrl,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
  });

  export { dbClient };





