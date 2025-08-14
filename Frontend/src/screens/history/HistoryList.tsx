import React, { useEffect, useState } from 'react';
import { Navigation } from '../../components/navigation';
import { getMovimientos } from '../../services/historyService';
import { toast } from 'react-toastify';

const HistoryList = () => {
    const [actions, setActions] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);

    const visibleActions = actions.slice(0, visibleCount);

    const fetchCategorias = async () => {
        try {
            const data = await getMovimientos();

            //Coloca los que tienen el id más reciente al comienzo
            const sorted = data.data.sort((a, b) => b.id - a.id);

            setActions(sorted)
        } catch (error) {
            console.error("Error completo:", error);
            toast.error("Error al cargar los movimientos");
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const handleVerMas = () => {
        setVisibleCount((prev) => prev + 10); // Carga 10 más cada vez que se da clic
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navigation />

            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Historial de Movimientos</h1>

                {actions.length > 0 ? (
                    <>
                        <div className="overflow-x-auto shadow-lg rounded-lg">
                            <table className="min-w-full bg-white rounded-lg">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700">
                                        <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Usuario</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Movimiento</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleActions.map((action, index) => (
                                        <tr
                                            key={action.id}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                } hover:bg-gray-100 transition-colors`}
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-800">{action.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(action.fecha).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">{action.nombreUsuario}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${action.movimiento === 'POST'
                                                        ? 'bg-green-500'
                                                        : action.movimiento === 'PUT'
                                                            ? 'bg-blue-500'
                                                            : action.movimiento === 'DELETE'
                                                                ? 'bg-red-500'
                                                                : 'bg-gray-500'
                                                        }`}
                                                >
                                                    {action.movimiento}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{action.descripcion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {visibleCount < actions.length && (
                            <div className="flex justify-center mt-4">
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    onClick={handleVerMas}
                                >
                                    Ver más
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500">No hay movimientos disponibles</p>
                )}
            </div>
        </div>
    );
};

export default HistoryList;
