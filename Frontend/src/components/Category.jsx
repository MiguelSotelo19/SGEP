import EstadoBadge from './EstadoBadge';

const Category = ({nombre, descripcion, estado}) => {
    return (
        <div className="cursor-pointer flex flex-col justify-between h-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{nombre}</h3>
                <p className="text-sm text-gray-600 mt-1">{descripcion}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
                <EstadoBadge estado={estado} />
                <button className="text-blue-600 hover:underline text-sm">Editar</button>
            </div>
        </div>
    )
}

export default Category