import EstadoBadge from "../../components/EstadoBadge";


const CategoryList = () => {

    const categorias = [
        {
            nombre: 'Electrónica',
            descripcion: 'Dispositivos electrónicos y accesorios',
            estado: 'Activo',
        },
        {
            nombre: 'Ropa',
            descripcion: 'Prendas de vestir para hombres, mujeres y niños',
            estado: 'Activo',
        },
        {
            nombre: 'Hogar',
            descripcion: 'Artículos para el hogar y decoración',
            estado: 'Inactivo',
        },
        {
            nombre: 'Alimentos',
            descripcion: 'Productos alimenticios y bebidas',
            estado: 'Activo',
        },
        {
            nombre: 'Deportes',
            descripcion: 'Equipamiento y accesorios deportivos',
            estado: 'Inactivo',
        },
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6 mt-6">
                <h1 className="text-3xl font-bold">Categorías de talleres</h1>
                <button className="bg-gray-100 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    Nueva Categoría
                </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="text-left bg-gray-50 text-sm text-gray-600">
                            <th className="px-6 py-4 font-semibold">Nombre</th>
                            <th className="px-6 py-4 font-semibold">Descripción</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((cat, index) => (
                            <tr key={index} className="border-t border-gray-100 text-sm">
                                <td className="px-6 py-4 text-gray-900">{cat.nombre}</td>
                                <td className="px-6 py-4 text-gray-600">{cat.descripcion}</td>
                                <td className="px-6 py-4">
                                    <EstadoBadge estado={cat.estado} />
                                </td>
                                <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">
                                    Editar
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CategoryList