import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db  = globalThis.prisma || new PrismaClient();

// 如果是非开发环境，则将 PrismaClient 实例挂载到全局变量中
if (process.env.NODE_ENV === 'production') globalThis.prisma = db;