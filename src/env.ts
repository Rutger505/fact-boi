import { z } from "zod";

const envSchema = z.object({
  // Discord
  DISCORD_TOKEN: z.string().min(1, "Discord token is required"),

  // Database
  POSTGRES_USER: z.string().min(1, "Database user is required"),
  POSTGRES_PASSWORD: z.string().min(1, "Database password is required"),
  POSTGRES_DATABASE: z.string().min(1, "Database name is required"),
  POSTGRES_HOST: z.string().min(1, "Database host is required"),
  POSTGRES_PORT: z.coerce.number().int().min(1, "Database port is required"),
  POSTGRES_URL: z.string().min(1, "Database URL is required"),
});

const parseEnv = <T extends z.ZodSchema>(schema: T): z.infer<T> => {
  try {
    return schema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid environment variables", { cause: error.errors });
    }
    throw error;
  }
};

const env = parseEnv(envSchema);

export default env;
