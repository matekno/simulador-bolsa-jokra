'use client';

import { useEffect, useState } from 'react';

const Saldos = () => {
  const [equipos, setEquipos] = useState([]);
  const [currentInstante, setCurrentInstante] = useState(null);
  const [preciosMap, setPreciosMap] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch('/api/equipos');
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
      }
    };
    fetchEquipos();
  }, []);

  const calcularValorTotal = (equipo) => {
    const valorInstrumentos = equipo.compras.reduce((acc, compra) => {
      const precioActual = preciosMap[compra.symbolId] || compra.precioActual;
      return acc + (compra.cantidad * precioActual);
    }, 0);
    return equipo.saldo + valorInstrumentos;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Saldo de Equipos</h1>
      {currentInstante && (
        <p>Instante actual: {currentInstante.id}</p>
      )}
      <ul>
        {equipos.map((equipo) => (
          <li key={equipo.id}>
            <h2>{equipo.nombre}: ${calcularValorTotal(equipo).toFixed(2)}</h2>
            <p>Saldo: ${equipo.saldo.toFixed(2)}</p>
            <h3>Instrumentos:</h3>
            <ul>
              {equipo.compras.map((compra) => (
                <li key={compra.id}>
                  {compra.symbol.nombre}: {compra.cantidad} unidades a ${preciosMap[compra.symbolId]?.toFixed(2) || compra.precioActual.toFixed(2)} cada una
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Saldos;
