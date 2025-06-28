import EstadoBadge from './EstadoBadge';

const Event = ({nombre_evento, lugar, tipo_evento, fecha, estatus, limite_usuarios, onEditMode, onDelete }) => {
    return (
        <div className="cursor-pointer flex flex-col justify-between h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <p className="text-lg font-semibold text-gray-900 break-words line-clamp-2">{nombre_evento}</p>
            <p className="text-sm text-gray-600 break-words line-clamp-2">📍 {lugar}</p>
            <p className="text-sm text-gray-600">📅 {fecha}</p>

            {tipo_evento?.toLowerCase() === "publico" && (
                <p className="text-sm text-gray-600">👥 Límite: {limite_usuarios}</p>
            )}

            <p className="text-sm text-gray-600">🗂️ Tipo: {tipo_evento}</p>

            <div className="flex items-center justify-between mt-4">
                <EstadoBadge estado={estatus} />
                <div>
                    <button
                        className="text-blue-600 hover:underline text-sm cursor-pointer m-2"
                        onClick={onEditMode}>
                        Editar
                    </button>

                    <button className="text-red-600 hover:underline text-sm cursor-pointer ml-2"
                        onClick={onDelete}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Event;
