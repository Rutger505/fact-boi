import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import  env from '../env';

const client = postgres({
  host: env.POSTGRES_HOST,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  port: env.POSTGRES_PORT,
});

export const db = drizzle(client, { schema });

export * from './schema';