import pg from 'pg';
const { Client } = pg;

// Database connection configuration

const databaseUrl = 'postgres://vini_user:iVJOgCw7DvVrNHcMNCgF4KvY36fPu5G4@dpg-cjddq7rbq8nc73fpsju0-a/vini';


export const dbClient = new Client({
    connectionString: databaseUrl,
  });






