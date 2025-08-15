import { Copy, X } from "lucide-react";
import { toast } from "react-toastify";

const CodeModal = ({ isOpen, onClose, eventCode }) => {
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(eventCode);
        toast.success("Código copiado al portapapeles");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 ">
            <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Código del Evento Privado</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                        <span className="font-mono text-xl">{eventCode}</span>
                        <button
                            onClick={handleCopy}
                            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            title="Copiar código"
                        >
                            <Copy size={20} />
                        </button>
                    </div>

                    <p className="mt-4 text-sm text-gray-600">
                        Este código es necesario para que los usuarios puedan registrarse en el evento privado.
                    </p>
                </div>

                <div className="flex justify-end p-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeModal;