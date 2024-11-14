import postgres from "postgres";
import env from "./src/env";

const DATABASE_NAME = env.POSTGRES_DATABASE;

const psql = postgres("", {
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
});

const databaseExists = await psql`
    SELECT 1 FROM pg_database WHERE datname = ${DATABASE_NAME}
  `;

if (!databaseExists.length) {
  await psql`CREATE DATABASE ${DATABASE_NAME}`;

  console.log(`Database ${DATABASE_NAME} created`);
} else {
  console.log(`Database ${DATABASE_NAME} already exists`);
}
