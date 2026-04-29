import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL || (
  process.env.DB_HOST
    ? `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`
    : undefined
);

if (!url) {
  throw new Error("DATABASE_URL ou DB_HOST/DB_USER/DB_PASSWORD/DB_NAME são necessários");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: { url },
});
