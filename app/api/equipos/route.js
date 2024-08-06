import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Obtener el instante actual
    const currentInstante = await prisma.instante.findFirst({
      where: { isCurrent: true },
    });

    if (!currentInstante) {
      return new Response(JSON.stringify({ equipos: [], currentInstante: null, error: 'No hay un instante actual' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtener los precios actuales de todos los símbolos en el instante actual
    const preciosActuales = await prisma.precio.findMany({
      where: { instanteId: currentInstante.id },
      include: { symbol: true },
    });

    // Crear un mapa de precios actuales por símbolo
    const preciosMap = preciosActuales.reduce((acc, precio) => {
      acc[precio.symbolId] = precio.precio;
      return acc;
    }, {});

    // Obtener los equipos y sus compras
    const equipos = await prisma.equipo.findMany({
      include: {
        compras: {
          include: { symbol: true },
        },
      },
    });

    return new Response(JSON.stringify({ equipos, currentInstante, preciosMap }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al obtener los equipos:', error);
    return new Response(JSON.stringify({ equipos: [], currentInstante: null, error: 'Error al obtener los equipos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}