import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const symbols = await prisma.symbol.findMany();
    return new Response(JSON.stringify(symbols), { status: 200 });
}
