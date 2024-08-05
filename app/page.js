// pages/index.js
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>Bienvenido a la aplicación de inversión</h1>
      <nav>
        <ul>
          <li>
            <Link href="/saldos">Ver Saldos de Equipos</Link>
          </li>
          <li>
            <Link href="/admin">Administración</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
