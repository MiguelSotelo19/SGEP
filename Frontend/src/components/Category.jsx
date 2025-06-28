import { useNavigate } from "react-router-dom";
import EstadoBadge from './EstadoBadge';

const Category = ({ id_categoria, nombre, descripcion, estado, onEditMode }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/events/category/${id_categoria}/${encodeURIComponent(nombre)}`);

    };

    return (
        <div onClick={handleClick} className="cursor-pointer flex flex-col justify-between h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{nombre}</h3>
                <p className="text-sm text-gray-600 mt-1">{descripcion}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
                <EstadoBadge estado={estado} />
                <button
                    className="text-blue-600 hover:underline text-sm cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditMode();
                    }}
                >Editar
                </button>
            </div>
        </div>
    )
}

export default Category