import { pgTable, bigint, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  displayName: varchar("display_name").notNull()
});