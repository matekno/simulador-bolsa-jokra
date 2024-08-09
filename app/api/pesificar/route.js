import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { porcentaje } = await req.json();

  if (porcentaje < 0 || porcentaje > 100) {
    return new Response(JSON.stringify({ error: 'Porcentaje inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Convertir porcentaje a decimal
    const factor = porcentaje / 100;

    // Obtener todos los equipos
    const equipos = await prisma.equipo.findMany();

    // Actualizar el saldo de cada equipo
    const updatedEquipos = await Promise.all(
      equipos.map((equipo) =>
        prisma.equipo.update({
          where: { id: equipo.id },
          data: { saldo: equipo.saldo * factor },
        })
      )
    );

    return new Response(JSON.stringify({ message: 'Saldos pesificados con éxito', equipos: updatedEquipos }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al pesificar los saldos:', error);
    return new Response(JSON.stringify({ error: 'Error al pesificar los saldos' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
