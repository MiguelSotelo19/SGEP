const EstadoBadge = ({ estado }) => {
    const esActivo = estado === 'Activo';
    return (
        <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${esActivo ? 'bg-gray-100 text-green-500' : 'bg-gray-200 text-red-500'
                }`}
        >
            {estado}
        </span>
    );
};

export default EstadoBadge;