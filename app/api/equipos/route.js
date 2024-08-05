import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const equipos = await prisma.equipo.findMany();
    return new Response(JSON.stringify(equipos), { status: 200 });
}
