import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

export const databaseUrl = process.env.DATABASE_URL;

export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : undefined;

export const db = pool
  ? drizzle({ client: pool, schema })
  : undefined;
