import pg from 'pg';
const { Client } = pg;
import { config } from "dotenv";
config();

const databaseUrl = process.env.DATABASE_URL;  ;


export const dbClient = new Client({
    connectionString: databaseUrl,
  });






