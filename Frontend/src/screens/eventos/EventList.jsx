import { useEffect, useState } from "react"
import { getEventos, deleteEvent } from "../../services/eventService"
import { ToastContainer, toast } from "react-toastify";
import Event from "../../components/Event";
import EventModal from "../../components/EventModal";
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom";

const EventList = () => {

    const { id_categoria, nombre_categoria } = useParams();

    const [eventos, setEventos] = useState([])

    const fetchEventos = async () => {
        try {
            const data = await getEventos()

            const filteredData = id_categoria
                ? data.filter(evento => evento.id_categoria == id_categoria)
                : data;
            setEventos(filteredData);

        } catch (error) {
            toast.error("Error al cargar los talleres")
        }
    }

    useEffect(() => {
        fetchEventos()
    }, [id_categoria])

    const [isOpen, setIsOpen] = useState(false);

    const handleModal = () => setIsOpen(true);

    const handleClose = () => {
        setIsOpen(false)
        setIsEditMode(false)
    }

    const [isEditMode, setIsEditMode] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

    const handleEditMode = (evento) => {
        setIsEditMode(true)
        setEventoSeleccionado(evento);
        setIsOpen(true)
    }

    const handleDelete = async (id_evento) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el evento permanentemente',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await deleteEvent({ id_evento });
                toast.success("Evento eliminado");
                fetchEventos();
            } catch (error) {
                toast.error("Error al eliminar evento");
                console.error(error);
            }
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6 mt-6">
                <h1 className="text-3xl font-bold">
                    {nombre_categoria ? `Talleres de la categoría ${decodeURIComponent(nombre_categoria)}` : "Talleres"}
                </h1>

                <button
                    onClick={handleModal}
                    className="bg-gray-100 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    Nuevo Taller
                </button>
            </div>
            <div className="border-b-2 border-gray-200 mb-5"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {eventos.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500">
                        Aún no hay talleres disponibles en esta categoría.
                    </div>
                ) : (
                    eventos.map((evento, index) => (
                        <Event
                            key={index}
                            nombre_evento={evento.nombre_evento}
                            lugar={evento.lugar}
                            tipo_evento={evento.tipo_evento}
                            fecha={evento.fecha}
                            estatus={evento.estatus ? "Activo" : "Inactivo"}
                            limite_usuarios={evento.limite_usuarios}
                            onEditMode={() => handleEditMode(evento)}
                            onDelete={() => handleDelete(evento.id_evento)}
                        />
                    ))
                )}
            </div>
            <EventModal
                isOpen={isOpen}
                handleClose={handleClose}
                onEventoCreado={fetchEventos}
                isEditMode={isEditMode}
                eventoSeleccionado={eventoSeleccionado}
            />
        </div>
    )
}

export default EventList