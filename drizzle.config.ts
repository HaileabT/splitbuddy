import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./lib/server/env";

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.databaseUrl!,
  },
});
