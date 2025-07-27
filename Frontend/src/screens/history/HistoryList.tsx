import React, { useEffect, useState } from 'react'
import { Navigation } from '../../components/navigation'
import { getMovimientos } from '../../services/historyService';
import { toast } from 'react-toastify';

const HistoryList = () => {

    const [actions, setActions] = useState([]);

    const fetchCategorias = async () => {
        try {
            const data = await getMovimientos();
            setActions(data.data);
        } catch (error) {
            console.error("Error completo:", error);
            toast.error("Error al cargar los movimientos");
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <div>
            <Navigation />

            <div className="p-4"></div>
                <h1 className="text-2xl font-bold mb-4">Historial de Movimientos</h1>
                
                {actions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border-b text-left">ID</th>
                                    <th className="px-4 py-2 border-b text-left">Fecha</th>
                                    <th className="px-4 py-2 border-b text-left">Usuario</th>
                                    <th className="px-4 py-2 border-b text-left">Movimiento</th>
                                    <th className="px-4 py-2 border-b text-left">Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actions.map((action) => (
                                    <tr key={action.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{action.id}</td>
                                        <td className="px-4 py-2 border-b">
                                            {new Date(action.fecha).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 border-b">{action.nombreUsuario}</td>
                                        <td className="px-4 py-2 border-b">
                                            <span className={`px-2 py-1 rounded text-white text-xs ${
                                                action.movimiento === 'POST' ? 'bg-green-500' : 
                                                action.movimiento === 'PUT' ? 'bg-blue-500' : 
                                                action.movimiento === 'DELETE' ? 'bg-red-500' : 'bg-gray-500'
                                            }`}>
                                                {action.movimiento}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 border-b">{action.descripcion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No hay movimientos disponibles</p>
                )}
            </div>
    )
}

export default HistoryList