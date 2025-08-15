import { X, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PrivateEventModal = ({
    isOpen,
    onClose,
    onConfirm,
    eventName
}) => {
    const [code, setCode] = useState('');

    // Efecto para limpiar el código cuando se abre/cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setCode(''); // Limpia el código cuando el modal se cierra
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!code.trim()) {
            toast.error("Por favor ingresa el código de acceso");
            return;
        }
        onConfirm(code);
        setCode(''); // Limpia el código después de confirmar
    };

    const handleClose = () => {
        setCode(''); // Limpia el código al cerrar
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Key className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Código de Acceso Requerido</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-gray-600">
                        Para inscribirte al evento <span className="font-semibold">"{eventName}"</span>,
                        ingresa el código de acceso proporcionado por el organizador.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código de acceso
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ingresa el código de 5 dígitos"
                            maxLength={5}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrivateEventModal;