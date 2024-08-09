import React from 'react';

const SaldoForm = ({ equipos, equipoId, cantidad, onEquipoChange, onCantidadChange, onAgregarSaldo }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Agregar Saldo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block">
            <span className="text-gray-700">Equipo:</span>
            <select
              onChange={(e) => onEquipoChange(e.target.value)}
              value={equipoId}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Seleccione un equipo</option>
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            <span className="text-gray-700">Cantidad a agregar:</span>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => onCantidadChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>
      </div>
      <button
        onClick={onAgregarSaldo}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        Agregar Saldo
      </button>
    </div>
  );
};

export default SaldoForm;