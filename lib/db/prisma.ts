import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";

const prismaClientSingleton = () => {
  const dbUrl = new URL(process.env.DATABASE_URL as string);

  // Trust the certificate if we are running in GitHub Actions
  const isCI = process.env.GITHUB_ACTIONS === "true";

  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port) || 3306,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace("/", ""),
    connectionLimit: 10, // Increased to prevent pool timeout during heavy E2E tests
    ssl: {
      rejectUnauthorized: !isCI, // False in CI, True in Production
    },
  });

  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;