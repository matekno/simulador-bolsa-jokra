import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { instanteId } = await req.json();

    if (!instanteId) {
      return new Response(JSON.stringify({ error: 'Falta el parámetro instanteId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const instanteIdInt = parseInt(instanteId, 10);

    // Desactivar el instante actual anterior
    await prisma.instante.updateMany({
      where: { isCurrent: true },
      data: { isCurrent: false },
    });

    // Activar el nuevo instante actual
    const updatedInstante = await prisma.instante.update({
      where: { id: instanteIdInt },
      data: { isCurrent: true },
    });

    return new Response(JSON.stringify({ message: 'Instante actualizado correctamente', updatedInstante }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al actualizar el instante:', error);
    return new Response(JSON.stringify({ error: 'Error al actualizar el instante', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
