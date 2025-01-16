import { PrismaClient, Prisma } from '../../prisma/generated/client'
const prisma = new PrismaClient({ log: ['error'] })
export default prisma
export const QueryMode = Prisma.QueryMode