'use client';

import React, { useEffect, useState } from 'react';

const Saldos = () => {
  const [equipos, setEquipos] = useState([]);
  const [currentInstante, setCurrentInstante] = useState(null);
  const [preciosMap, setPreciosMap] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEquipos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/equipos' , { next: { revalidate: 0 }});
      const data = await response.json();
      if (response.ok) {
        setEquipos(data.equipos || []);
        setCurrentInstante(data.currentInstante);
        setPreciosMap(data.preciosMap || {});
      } else {
        setError(data.error || 'Error al obtener los datos');
      }
    } catch (err) {
      setError('Error al obtener los datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const agruparCompras = (compras) => {
    const agrupadas = {};

    compras.forEach((compra) => {
      const key = `${compra.symbolId}-${compra.instanteId}`;
      if (!agrupadas[key]) {
        agrupadas[key] = {
          ...compra,
          cantidad: 0,
        };
      }
      agrupadas[key].cantidad += compra.cantidad;
    });

    return Object.values(agrupadas);
  };

  const calcularValorTotal = (equipo) => {
    const valorInstrumentos = equipo.compras.reduce((acc, compra) => {
      const precioActual = preciosMap[compra.symbolId] || compra.precioActual;
      return acc + (compra.cantidad * precioActual);
    }, 0);
    return equipo.saldo + valorInstrumentos;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Saldo de Equipos</h1>
        {currentInstante && (
          <p className="text-xl text-gray-600 mb-8 text-center">Instante actual: {currentInstante.id}</p>
        )}
        <div className="text-center mb-8">
          <button
            onClick={fetchEquipos}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Actualizar Datos
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipos.map((equipo) => (
            <div key={equipo.id} className="bg-white overflow-hidden shadow-lg rounded-lg divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {equipo.nombre}
                </h2>
                <p className="mt-1 text-2xl font-semibold text-indigo-600">
                  ${calcularValorTotal(equipo).toFixed(2)}
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <p className="text-sm font-medium text-gray-500">Saldo</p>
                <p className="mt-1 text-lg text-gray-900">${equipo.saldo.toFixed(2)}</p>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">Instrumentos</h3>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {agruparCompras(equipo.compras).map((compra) => (
                      <li key={`${compra.symbolId}-${compra.instanteId}`} className="py-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{compra.symbol.nombre}</p>
                          <p className="text-sm text-gray-500">{compra.cantidad} unidades</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Comprada a ${compra.precioActual.toFixed(2)} cada una
                          <br />
                          <span style={{ color: preciosMap[compra.symbolId]?.toFixed(2) < compra.precioActual.toFixed(2) ? 'red' : 'green' }}>
                            Valor actual ${preciosMap[compra.symbolId]?.toFixed(2)}
                          </span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Saldos;
