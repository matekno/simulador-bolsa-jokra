import React from 'react';

const CompraForm = ({ equipos, symbols, equipoId, symbolId, precioActual, cantidad, onEquipoChange, onSymbolChange, onCantidadChange, onCompra }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Realizar Compra</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block">
            <span className="text-gray-700">Equipo Inversor:</span>
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
            <span className="text-gray-700">Acción a comprar:</span>
            <select
              onChange={(e) => onSymbolChange(e.target.value)}
              value={symbolId}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Seleccione una acción</option>
              {symbols.map((symbol) => (
                <option key={symbol.id} value={symbol.id}>
                  {symbol.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            <span className="text-gray-700">Precio actual:</span>
            <input
              type="text"
              value={precioActual}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="text-gray-700">Cantidad:</span>
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
        onClick={onCompra}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Realizar Compra
      </button>
    </div>
  );
};

export default CompraForm;