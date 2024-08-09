import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { equipoId, symbolId, cantidad } = await req.json();

  try {
    // Obtener el instante actual
    const currentInstante = await prisma.instante.findFirst({
      where: { isCurrent: true },
    });

    if (!currentInstante) {
      return new Response(JSON.stringify({ error: 'No hay un instante actual' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtener el precio actual de la acción
    const precioActual = await prisma.precio.findFirst({
      where: { instanteId: currentInstante.id, symbolId },
    });

    if (!precioActual) {
      return new Response(JSON.stringify({ error: 'Precio actual no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtener la cantidad total de acciones que el equipo posee de este símbolo
    const comprasTotales = await prisma.compra.findMany({
      where: { equipoId, symbolId },
    });

    const cantidadTotalPosesida = comprasTotales.reduce((acc, compra) => acc + compra.cantidad, 0);

    if (cantidadTotalPosesida < cantidad) {
      return new Response(JSON.stringify({ error: 'Cantidad de acciones insuficiente' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calcular el total de la venta
    const totalVenta = precioActual.precio * cantidad;

    // Distribuir la venta en las compras existentes
    let cantidadRestante = cantidad;
    for (const compra of comprasTotales) {
      if (cantidadRestante > 0) {
        const cantidadVendida = Math.min(cantidadRestante, compra.cantidad);
        cantidadRestante -= cantidadVendida;

        await prisma.compra.update({
          where: { id: compra.id },
          data: { cantidad: compra.cantidad - cantidadVendida },
        });
      }
    }

    // Actualizar el saldo del equipo
    await prisma.equipo.update({
      where: { id: equipoId },
      data: { saldo: { increment: totalVenta } },
    });

    return new Response(JSON.stringify({ message: 'Venta realizada con éxito', totalVenta }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al realizar la venta:', error);
    return new Response(JSON.stringify({ error: 'Error al realizar la venta' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
