import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const instanteId = searchParams.get('instanteId');
  const symbolId = searchParams.get('symbolId');

  if (!instanteId || !symbolId) {
    return new Response(JSON.stringify({ error: 'Faltan parámetros' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const precio = await prisma.precio.findFirst({
      where: {
        instanteId: parseInt(instanteId),
        symbolId: parseInt(symbolId),
      },
    });

    if (precio) {
      return new Response(JSON.stringify(precio), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Precio no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener el precio' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}