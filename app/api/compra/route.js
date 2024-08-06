import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    const { equipoId, symbolId, precioActual, cantidad, instanteId, total } = await req.json();

    try {
        const compra = await prisma.compra.create({
            data: {
                equipoId,
                symbolId,
                precioActual,
                cantidad,
                instanteId,
                total,
            },
        });

        await prisma.equipo.update({
            where: { id: equipoId },
            data: {
                saldo: {
                    decrement: total,
                },
            },
        });

        return new Response(JSON.stringify(compra), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error al realizar la compra' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}