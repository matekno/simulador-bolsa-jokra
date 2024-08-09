import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { equipoId, cantidad } = await req.json();

  try {
    // Verificar que el equipo existe
    const equipo = await prisma.equipo.findUnique({
      where: { id: parseInt(equipoId, 10) },
    });

    if (!equipo) {
      return new Response(JSON.stringify({ error: 'Equipo no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Sumar saldo al equipo
    const updatedEquipo = await prisma.equipo.update({
      where: { id: equipo.id },
      data: { saldo: { increment: parseFloat(cantidad) } },
    });

    return new Response(JSON.stringify({ message: 'Saldo actualizado con éxito', saldo: updatedEquipo.saldo }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al actualizar el saldo:', error);
    return new Response(JSON.stringify({ error: 'Error al actualizar el saldo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
