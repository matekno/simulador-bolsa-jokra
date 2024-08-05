'use client';

import { useEffect, useState } from 'react';

const Admin = () => {
    const [equipos, setEquipos] = useState([]);
    const [symbols, setSymbols] = useState([]);
    const [instantes, setInstantes] = useState([]);
    const [equipoId, setEquipoId] = useState('');
    const [symbolId, setSymbolId] = useState('');
    const [precioActual, setPrecioActual] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [instanteId, setInstanteId] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const [equiposRes, symbolsRes, instantesRes] = await Promise.all([
                fetch('/api/equipos'),
                fetch('/api/symbols'),
                fetch('/api/instantes'),
            ]);
            const equiposData = await equiposRes.json();
            const symbolsData = await symbolsRes.json();
            const instantesData = await instantesRes.json();
            setEquipos(equiposData);
            setSymbols(symbolsData);
            setInstantes(instantesData);
        };
        fetchData();
    }, []);

    const handleCompra = async () => {
        const equipo = equipos.find((e) => e.id === parseInt(equipoId));
        const total = parseFloat(precioActual) * parseInt(cantidad);

        if (equipo && equipo.saldo >= total) {
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
                    instanteId: parseInt(instanteId),
                    total,
                }),
            });

            if (res.ok) {
                setMensaje('Compra realizada con éxito');
            } else {
                setMensaje('Error al realizar la compra');
            }
        } else {
            setMensaje('Saldo insuficiente');
        }
    };

    return (
        <div>
            <h1>Administración</h1>
            <label>
                Equipo Inversor:
                <select onChange={(e) => setEquipoId(e.target.value)} value={equipoId}>
                    <option value="">Seleccione un equipo</option>
                    {equipos.map((equipo) => (
                        <option key={equipo.id} value={equipo.id}>
                            {equipo.nombre}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Símbolo a comprar:
                <select onChange={(e) => setSymbolId(e.target.value)} value={symbolId}>
                    <option value="">Seleccione un símbolo</option>
                    {symbols.map((symbol) => (
                        <option key={symbol.id} value={symbol.id}>
                            {symbol.nombre}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Precio actual:
                <input
                    type="number"
                    value={precioActual}
                    onChange={(e) => setPrecioActual(e.target.value)}
                />
            </label>
            <br />
            <label>
                Cantidad:
                <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                />
            </label>
            <br />
            <label>
                Instante:
                <select onChange={(e) => setInstanteId(e.target.value)} value={instanteId}>
                    <option value="">Seleccione un instante</option>
                    {instantes.map((instante) => (
                        <option key={instante.id} value={instante.id}>
                            {new Date(instante.timestamp).toLocaleString()}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <button onClick={handleCompra}>Realizar Compra</button>
            <p>{mensaje}</p>
        </div>
    );
};

export default Admin;
