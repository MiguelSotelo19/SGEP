const EstadoBadge = ({ estado }) => {
    const esActivo = estado === 'Activo';
    return (
        <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${esActivo ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'
                }`}
        >
            {estado}
        </span>
    );
};

export default EstadoBadge;