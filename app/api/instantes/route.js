import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const instantes = await prisma.instante.findMany();
    return new Response(JSON.stringify(instantes), { status: 200 });
}
