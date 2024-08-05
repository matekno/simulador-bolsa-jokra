'use client';

import { useEffect, useState } from 'react';

const Saldos = () => {
    const [equipos, setEquipos] = useState([]);

    useEffect(() => {
        const fetchEquipos = async () => {
            const response = await fetch('/api/equipos');
            const data = await response.json();
            setEquipos(data);
        };
        fetchEquipos();
    }, []);

    return (
        <div>
            <h1>Saldo de Equipos</h1>
            <ul>
                {equipos.map((equipo) => (
                    <li key={equipo.id}>
                        {equipo.nombre}: ${equipo.saldo.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Saldos;
