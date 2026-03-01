import dotenv from "dotenv";
import { existsSync } from "fs";
import { defineConfig } from "prisma/config";

if (existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
