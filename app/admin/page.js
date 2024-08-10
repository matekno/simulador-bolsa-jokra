// File: pages/admin.js
'use client';

import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import InstanteUpdater from './components/InstanteUpdater';
import CompraForm from './components/CompraForm';
import VentaForm from './components/VentaForm';
import SaldoForm from './components/SaldoForm';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
  const [cantidadVenta, setCantidadVenta] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/initialData', { next: { revalidate: 0 }});
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
          const res = await fetch(`/api/precios?instanteId=${currentInstanteId}&symbolId=${symbolId}`, { next: { revalidate: 0 }});
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

  const handleLogin = () => {
    setIsAuthenticated(true);
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
        next: { revalidate: 0 },
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
          next: { revalidate: 0 },
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

  const handleVenta = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/vender', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipoId: parseInt(equipoId),
          symbolId: parseInt(symbolId),
          cantidad: parseInt(cantidadVenta),
        }),
        next: { revalidate: 0 },
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(`Venta realizada con éxito. Total vendido: $${data.totalVenta}`);
      } else {
        setMensaje(data.error || 'Error al realizar la venta');
      }
    } catch (error) {
      setMensaje('Error al realizar la venta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgregarSaldo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/addSaldo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipoId: parseInt(equipoId),
          cantidad: parseFloat(cantidad),
        }),
        next: { revalidate: 0 }, 
      });
  
      const data = await res.json();
      if (res.ok) {
        setMensaje(`Saldo actualizado con éxito. Nuevo saldo: $${data.saldo.toFixed(2)}`);
        setEquipos((prevEquipos) =>
          prevEquipos.map((equipo) =>
            equipo.id === parseInt(equipoId) ? { ...equipo, saldo: data.saldo } : equipo
          )
        );
      } else {
        setMensaje(data.error || 'Error al actualizar el saldo');
      }
    } catch (error) {
      setMensaje('Error al actualizar el saldo');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8 text-center">Administración</h1>

      <InstanteUpdater
        instantes={instantes}
        currentInstanteId={currentInstanteId}
        onChangeInstante={handleChangeInstante}
      />

      <CompraForm
        equipos={equipos}
        symbols={symbols}
        equipoId={equipoId}
        symbolId={symbolId}
        precioActual={precioActual}
        cantidad={cantidad}
        onEquipoChange={setEquipoId}
        onSymbolChange={setSymbolId}
        onCantidadChange={setCantidad}
        onCompra={handleCompra}
      />

      <VentaForm
        equipos={equipos}
        symbols={symbols}
        equipoId={equipoId}
        symbolId={symbolId}
        precioActual={precioActual}
        cantidadVenta={cantidadVenta}
        onEquipoChange={setEquipoId}
        onSymbolChange={setSymbolId}
        onCantidadVentaChange={setCantidadVenta}
        onVenta={handleVenta}
      />

      <SaldoForm
        equipos={equipos}
        equipoId={equipoId}
        cantidad={cantidad}
        onEquipoChange={setEquipoId}
        onCantidadChange={setCantidad}
        onAgregarSaldo={handleAgregarSaldo}
      />

      {mensaje && (
        <div className="mt-4 p-4 rounded-md bg-yellow-100 border border-yellow-400 text-yellow-700">
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default Admin;