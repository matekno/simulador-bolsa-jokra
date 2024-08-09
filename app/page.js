import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
        Simulador Jokrim
      </h1>
      <nav className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <ul className="space-y-4">
          <li>
            <Link
              href="/saldos"
              className="block text-center text-lg font-semibold text-blue-500 hover:bg-blue-100 rounded-md py-3 transition duration-300"
            >
              Ver Saldos de Equipos
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="block text-center text-lg font-semibold text-blue-500 hover:bg-blue-100 rounded-md py-3 transition duration-300"
            >
              Administración
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
