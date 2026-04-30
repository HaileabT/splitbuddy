import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";

let db: ReturnType<typeof drizzle> | undefined = undefined;
export const getDb = () => {
  if (!db) db = drizzle(env.databaseUrl);
  return db;
};
