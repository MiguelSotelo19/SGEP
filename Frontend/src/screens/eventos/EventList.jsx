import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getEventos, deleteEvent } from "../../services/eventService";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

import { Navigation } from "../../components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  ChartNoAxesColumnIcon,
} from "lucide-react";

import EventModal from "../../components/EventModal";
import { getCategories } from "../../services/categoryService";
import { entry, getEventosInscritos } from "../../services/entryService"; // No olvides importar entry
import "../css/main.css";

const EventList = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasD, setCategoriasD] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("all");

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const location = useLocation();
  const { id_categoria } = location.state || {};
  const user = JSON.parse(localStorage.getItem("User") ?? "{}");

  const [busqueda, setBusqueda] = useState("");

  const [eventosInscritos, setEventosInscritos] = useState();

  const fetchCategorias = async () => {
    try {
      const data = await getCategories();
      setCategoriasD(data.data);
    } catch (error) {
      toast.error("Error al cargar las categorías");
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchEventos = async () => {
    try {
      const data = await getEventos();

      const cats = [
        ...new Map(
          data.map((e) => [
            e.id_categoria,
            {
              id_categoria: e.id_categoria,
              nombre_categoria: e.nombre_categoria || "Sin categoría",
            },
          ])
        ).values(),
      ];
      setCategorias(cats);

      if (id_categoria) {
        setCategoriaSeleccionada(String(id_categoria));
        setEventos(data);
      } else {
        setEventos(data);
      }
    } catch (error) {
      toast.error("Error al cargar los talleres");
    }
  };

const fetchEventosInscritos = async () => {
  const id_usuario = user.idUsuario || user.usuario?.id || user.id;
  if (!id_usuario) return;

  try {
    const inscritos = await getEventosInscritos(id_usuario);
    setEventosInscritos(inscritos || []);
  } catch (error) {
    setEventosInscritos([]);
  }
};

const estaInscrito = (id_evento) => {
  if (!Array.isArray(eventosInscritos)) return false;

  const resultado = eventosInscritos.some(ev => {
       const inscritoId = ev.evento.id_evento;
    console.log(`Comparando ${inscritoId} con ${id_evento}`);
    return String(inscritoId) === String(id_evento);
  });

  console.log(`Evento ${id_evento} -> inscrito: `, resultado);
  return resultado;
};

  useEffect(() => {
  fetchEventos();
  fetchEventosInscritos();
}, []);

useEffect(() => {
  console.log("eventosInscritos:", eventosInscritos);
}, [eventosInscritos]);


  const handleModal = () => {
    if (categoriaSeleccionada === "all") {
      toast.info("Antes debe seleccionar una categoría");
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsEditMode(false);
  };

  const handleEditMode = (evento) => {
    setIsEditMode(true);
    setEventoSeleccionado(evento);
    setIsOpen(true);
  };

  const handleDelete = async (id_evento) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el evento permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent({ id_evento });
        toast.success("Evento eliminado");
        fetchEventos();
      } catch (error) {
        toast.error("Error al eliminar evento");
      }
    }
  };

  const inscribirUsuario = async (id_evento) => {
    const userStr = localStorage.getItem("User");
    if (!userStr) {
      toast.error("Debes iniciar sesión para inscribirte");
      return;
    }

    const user = JSON.parse(userStr);

    const id_usuario = user.idUsuario || user.usuario?.id || user.id || null;
    const rolId = user.rol || user.rolUsuario || null;

    if (!id_usuario) {
      toast.error("No se encontró el ID del usuario");
      return;
    }

    if (rolId !== 2) {
      toast.error("No tienes permiso para inscribirte a este taller");
      return;
    }

    try {
      await entry({ id_usuario, id_evento });
      toast.success("Inscripción exitosa");

      fetchEventosInscritos();
    } catch (error) {
      toast.error("Error al inscribirte al taller");
      console.error("Error en inscripción:", error);
    }
  };

  const eventosFiltrados = eventos.filter((e) => {
    const coincideCategoria =
      categoriaSeleccionada === "all" ||
      String(e.id_categoria) === categoriaSeleccionada;
    const coincideBusqueda =
      e.nombre_evento.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.lugar?.toLowerCase().includes(busqueda.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Talleres</h1>
            <p className="text-gray-600 mt-2">
              Consulta o administra los talleres disponibles
            </p>
          </div>
          {(user.rol == 1) ? (
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleModal}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Taller
            </Button>
          ): (<></>)}
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar talleres..."
                className="pl-10"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <Select
              value={categoriaSeleccionada}
              onValueChange={(value) => setCategoriaSeleccionada(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categoriasD.map((cat) => (
                  <SelectItem
                    key={cat.id_categoria}
                    value={String(cat.id_categoria)}
                  >
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid de eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No hay talleres para esta categoría.
            </div>
          ) : (
            eventosFiltrados.map((evento) => {
              const inscrito = estaInscrito(evento.id_evento);
              console.log(`Evento ${evento.id_evento} -> inscrito: `, inscrito);
               return(
              <Card
                key={evento.id_evento}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{evento.tipo_evento}</Badge>
                    <Badge
                      variant={evento.estatus ? "default" : "destructive"}
                      className={
                        evento.estatus ? "bg-green-100 text-green-800" : ""
                      }
                    >
                      {evento.estatus ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {evento.nombre_evento}
                  </CardTitle>
                  <CardDescription>{evento.lugar}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(evento.fecha).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{evento.hora || "Sin hora"}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{evento.lugar}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{evento.limite_usuarios} asistentes</span>
                    </div>
                  </div>

                  {user?.rol === 1 ? (
                    <div className="flex justify-between items-center pt-4 gap-2">
                      <Button
                        variant="outline"
                        className="w-full action"
                        onClick={() => handleEditMode(evento)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full action delete"
                        onClick={() => handleDelete(evento.id_evento)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <Button
            variant="outline"
            className="w-full princ"
            onClick={() => inscribirUsuario(evento.id_evento)}
            disabled={inscrito}
          >
            {inscrito ? "Inscrito" : "Inscribirse al taller"}
          </Button>
                  )}
                </CardContent>
              </Card>
               );
})
          )}
        </div>
      </div>

      <EventModal
        isOpen={isOpen}
        handleClose={handleClose}
        onEventoCreado={fetchEventos}
        isEditMode={isEditMode}
        eventoSeleccionado={eventoSeleccionado}
        categoriaSeleccionada={categoriaSeleccionada}
      />
    </div>
  );
};

export default EventList;
