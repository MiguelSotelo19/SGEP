import { useEffect, useState } from "react";
import { Users, X, Search } from "lucide-react";
import { toast } from "react-toastify";
import { deleteAsistentesByEvento, getAsistentesByEvento } from "../services/entryService";

const AssistantsListModal = ({ isOpen, onClose, evento, onAsistenteEliminado }) => {

    const [asistentes, setAsistentes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (isOpen && evento?.id_evento) {
            fetchAsistentes();
        }
    }, [isOpen, evento]);

    const fetchAsistentes = async () => {
        try {
            const data = await getAsistentesByEvento(evento.id_evento);
            setAsistentes(data || []);
        } catch (error) {
            toast.error("Error al cargar los asistentes");
        }
    };

    const handleEliminar = async (id_usuario) => {
        try {
            await deleteAsistentesByEvento({ id_usuario, id_evento: evento.id_evento });
            toast.success("Asistencia anulada");
            fetchAsistentes();
            if (onAsistenteEliminado) {
                onAsistenteEliminado(evento.id_evento);
            }
        } catch (error) {
            toast.error("Error al anular asistencia");
        }
    };

    // 🔍 Filtrar por nombre o apellido
    const filteredAsistentes = asistentes.filter((asistente) =>
        `${asistente.usuario.nombre} ${asistente.usuario.apellido_paterno}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return isOpen ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Asistentes al evento
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                {/* Search bar */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {filteredAsistentes.length === 0 ? (
                        <p className="text-center text-gray-500">No se encontraron asistentes.</p>
                    ) : (
                        filteredAsistentes.map((asistente) => (
                            <div key={asistente.usuario.id_usuario} className="flex justify-between items-center border rounded-lg px-4 py-3">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {asistente.usuario.nombre} {asistente.usuario.apellido_paterno}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {asistente.usuario.correo || "Sin correo"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleEliminar(asistente.usuario.id_usuario)}
                                    className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Anular
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default AssistantsListModal;
