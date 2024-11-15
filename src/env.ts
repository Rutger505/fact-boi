import { z } from "zod";

const envSchema = z.object({
  // Discord
  DISCORD_TOKEN: z.string().min(1, "Discord token is required"),
  CLIENT_ID: z.string().min(1, "Client ID is required"),

  // Database
  POSTGRES_USER: z.string().min(1, "Database user is required"),
  POSTGRES_PASSWORD: z.string().min(1, "Database password is required"),
  POSTGRES_DATABASE: z.string().min(1, "Database name is required"),
  POSTGRES_HOST: z.string().min(1, "Database host is required"),
  POSTGRES_PORT: z.coerce.number().int().min(1, "Database port is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error("Invalid environment variables", { cause: parsedEnv.error.errors });
}

const env = parsedEnv.data;

export default env;
