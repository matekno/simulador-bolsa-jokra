'use client';

import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [instantes, setInstantes] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [currentInstanteId, setCurrentInstanteId] = useState(null);
  const [equipoId, setEquipoId] = useState('');
  const [symbolId, setSymbolId] = useState('');
  const [precioActual, setPrecioActual] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/initialData');
        const data = await res.json();
        setEquipos(data.equipos);
        setInstantes(data.instantes);
        setSymbols(data.symbols);
        const currentInstante = data.instantes.find(inst => inst.isCurrent);
        setCurrentInstanteId(currentInstante ? currentInstante.id : null);
      } catch (error) {
        setMensaje('Error al cargar los datos iniciales');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchPrecio = async () => {
      if (currentInstanteId && symbolId) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/precios?instanteId=${currentInstanteId}&symbolId=${symbolId}`);
          const data = await res.json();
          if (data.precio) {
            setPrecioActual(data.precio); 
          } else {
            setPrecioActual("");
          }
        } catch (error) {
          setMensaje('Error al obtener el precio');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchPrecio();
  }, [currentInstanteId, symbolId]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '123') {
      setIsAuthenticated(true);
    } else {
      setMensaje('Contraseña incorrecta');
    }
  };

  const handleCompra = async () => {
    setIsLoading(true);
    const equipo = equipos.find((e) => e.id === parseInt(equipoId));
    const total = parseFloat(precioActual) * parseInt(cantidad);

    if (equipo && equipo.saldo >= total) {
      try {
        const res = await fetch('/api/compra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            equipoId: parseInt(equipoId),
            symbolId: parseInt(symbolId),
            precioActual: parseFloat(precioActual),
            cantidad: parseInt(cantidad),
            instanteId: parseInt(currentInstanteId),
            total,
          }),
        });

        if (res.ok) {
          setMensaje('Compra realizada con éxito');
        } else {
          setMensaje('Error al realizar la compra');
        }
      } catch (error) {
        setMensaje('Error al realizar la compra');
      } finally {
        setIsLoading(false);
      }
    } else {
      setMensaje('Saldo insuficiente');
      setIsLoading(false);
    }
  };

  const handleChangeInstante = async (instanteId) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/updateInstante', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instanteId: parseInt(instanteId, 10) }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setCurrentInstanteId(instanteId);
        setMensaje('Instante actualizado correctamente');
      } else {
        setMensaje(data.error || 'Error al actualizar el instante');
      }
    } catch (error) {
      setMensaje('Error al actualizar el instante');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4 text-center">Administración</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Iniciar sesión
            </button>
          </form>
          {mensaje && <p className="mt-4 text-red-500 text-center">{mensaje}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8 text-center">Administración</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Actualizar Instante</h2>
        <div className="flex items-center space-x-4">
          <label className="block">
            <span className="text-gray-700">Instante actual:</span>
            <select
              onChange={(e) => handleChangeInstante(e.target.value)}
              value={currentInstanteId}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {instantes.map((instante) => (
                <option key={instante.id} value={instante.id}>
                  {instante.id}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => handleChangeInstante(currentInstanteId)}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Actualizar
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Realizar Compra</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">
              <span className="text-gray-700">Equipo Inversor:</span>
              <select
                onChange={(e) => setEquipoId(e.target.value)}
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
                onChange={(e) => setSymbolId(e.target.value)}
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
                onChange={(e) => setCantidad(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
          </div>
        </div>
        <button
          onClick={handleCompra}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Realizar Compra
        </button>
      </div>
      
      {mensaje && (
        <div className="mt-4 p-4 rounded-md bg-yellow-100 border border-yellow-400 text-yellow-700">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Admin;