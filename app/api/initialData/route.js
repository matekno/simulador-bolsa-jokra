// app/api/initialData/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const equipos = await prisma.equipo.findMany();
    const instantes = await prisma.instante.findMany();
    const symbols = await prisma.symbol.findMany();
    return new Response(JSON.stringify({ equipos, instantes, symbols }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener los datos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
