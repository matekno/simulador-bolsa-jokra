'use client';

import React, { useState } from 'react';

const Pesificar = () => {
  const [porcentaje, setPorcentaje] = useState(100);
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePesificar = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/pesificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ porcentaje }),
        next: { revalidate: 0 },
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(`Saldos pesificados con éxito a ${porcentaje}%`);
      } else {
        setMensaje(data.error || 'Error al pesificar los saldos');
      }
    } catch (error) {
      setMensaje('Error al pesificar los saldos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Pesificar Saldos</h1>
      <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
        <label className="text-xl font-medium mb-4">Porcentaje de Pesificación: {porcentaje}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
          className="w-full mb-8"
        />
        <button
          onClick={handlePesificar}
          className="w-full py-4 bg-blue-500 text-white text-2xl font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {isLoading ? 'Pesificando...' : 'Pesificar Saldos'}
        </button>
      </div>
      {mensaje && (
        <div className="mt-8 p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Pesificar;
