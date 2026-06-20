import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✨ ESSA LINHA COMPATIBILIZA OS DOIS FORMATOS DE IMPORTAÇÃO E MATA O ERRO 2613:
export default prisma;
