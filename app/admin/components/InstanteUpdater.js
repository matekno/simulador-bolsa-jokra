import React from 'react';

const InstanteUpdater = ({ instantes, currentInstanteId, onChangeInstante }) => {
  // Ordenar los instantes de menor a mayor por su ID
  const instantesOrdenados = [...instantes].sort((a, b) => a.id - b.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Actualizar Instante</h2>
      <div className="flex items-center space-x-4">
        <label className="block">
          <span className="text-gray-700">Instante actual:</span>
          <select
            onChange={(e) => onChangeInstante(e.target.value)}
            value={currentInstanteId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            {instantesOrdenados.map((instante) => (
              <option key={instante.id} value={instante.id}>
                {instante.id}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default InstanteUpdater;
