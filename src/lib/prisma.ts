import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Ini akan menampilkan query database di terminal kamu (bagus untuk belajar)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;