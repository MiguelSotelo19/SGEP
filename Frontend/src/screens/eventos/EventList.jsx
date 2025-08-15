import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getEventos, deleteEvent } from "../../services/eventService";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

import { Navigation } from "../../components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Plus, Calendar, Clock, MapPin, Users, Search, Lock } from "lucide-react";

import EventModal from "../../components/EventModal";
import { getCategories } from "../../services/categoryService";
import { entry, getEventosInscritos, getAsistentesByEvento } from "../../services/entryService";
import "../css/main.css";

import AssistantsListModal from "../../components/AssistantsListModal";

import { isPastEvent, shouldDisableRegistration } from "../../utils/dateUtils";

import CodeModal from "../../components/CodeModal";

import PrivateEventModal from "../../components/PrivateModal";

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
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [asistentesOpen, setAsistentesOpen] = useState(false);
  const [eventoActual, setEventoActual] = useState(null);
  const [conteoAsistentes, setConteoAsistentes] = useState({});

  const [loading, setLoading] = useState(false);

  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [selectedEventCode, setSelectedEventCode] = useState('');

  const [privateEventModalOpen, setPrivateEventModalOpen] = useState(false);
  const [selectedPrivateEvent, setSelectedPrivateEvent] = useState(null);

  const [visibleCount, setVisibleCount] = useState(6);

  const handleVerMas = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handlePrivateEventClick = (evento, e) => {
    const isActionButton = e.target.closest('.action-button') ||
      e.target.closest('.delete-button');

    if (user?.rol === 1 &&
      evento.tipo_evento?.toLowerCase() === "privado" &&
      !isActionButton) {
      setSelectedEventCode(evento.codigo);
      setCodeModalOpen(true);
    }
  };

  const fetchCategorias = async () => {
    try {
      const data = await getCategories();
      setCategoriasD(data.data);
    } catch (error) {
      toast.error("Error al cargar las categorías");
    }
  };

  const fetchConteoAsistentes = async (eventos) => {
    const conteos = {};
    for (const evento of eventos) {
      try {
        const asistentes = await getAsistentesByEvento(evento.id_evento);
        conteos[evento.id_evento] = Array.isArray(asistentes) ? asistentes.length : 0;
      } catch (error) {
        conteos[evento.id_evento] = 0;
      }
    }
    setConteoAsistentes(conteos);
  };

  const fetchEventos = async () => {
    setLoading(true);
    setEventos([]);
    try {
      const data = await getEventos();
      const eventosFiltrados = filtrarEventosPorRol(data);

      const cats = [
        ...new Map(
          eventosFiltrados.map((e) => [
            e.id_categoria,
            {
              id_categoria: e.id_categoria,
              nombre_categoria: e.nombre_categoria || "Sin categoría",
            },
          ])
        ).values(),
      ];
      setCategorias(cats);

      setEventos(eventosFiltrados);

      await fetchConteoAsistentes(eventosFiltrados);

      if (id_categoria) {
        setCategoriaSeleccionada(String(id_categoria));
      }
    } catch (error) {
      toast.error("Error al cargar los talleres");
    } finally {
      setLoading(false);
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

  const handleVerAsistentes = (evento) => {
    setEventoActual(evento);
    setAsistentesOpen(true);
  };

  const estaInscrito = (id_evento) => {
    if (!Array.isArray(eventosInscritos)) return false;

    return eventosInscritos.some((ev) => {
      const inscritoId = ev.evento.id_evento;
      return String(inscritoId) === String(id_evento);
    });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchEventos();
    fetchEventosInscritos();
  }, [id_categoria]);

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
    // Primero obtener el usuario del localStorage
    const userStr = localStorage.getItem("User"); // ✅ Mover al inicio

    // Verificar si hay usuario logueado
    if (!userStr) {
      toast.error("Debes iniciar sesión para inscribirte");
      return;
    }

    // Ahora podemos usar userStr para parsear el usuario
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

    const evento = eventos.find((e) => e.id_evento === id_evento);
    if (!evento) {
      toast.error("Evento no encontrado");
      return;
    }

    // Si es evento privado, muestra el modal
    if (evento.tipo_evento?.toLowerCase() === "privado") {
      setSelectedPrivateEvent(evento);
      setPrivateEventModalOpen(true);
      return;
    }

    const actuales = conteoAsistentes[id_evento] ?? 0;
    if (actuales >= evento.limite_usuarios) {
      toast.error("El evento ha alcanzado el límite de usuarios.");
      return;
    }

    try {
      await entry({ id_usuario, id_evento });
      toast.success("Inscripción exitosa");
      fetchEventosInscritos();

      setConteoAsistentes((prev) => ({
        ...prev,
        [id_evento]: actuales + 1,
      }));
    } catch (error) {
      toast.error("Error al inscribirte al taller");
      console.error("Error en inscripción:", error);
    }
  };

  const handlePrivateEventRegistration = async (code) => {
    setPrivateEventModalOpen(false);

    const userStr = localStorage.getItem("User");
    const user = JSON.parse(userStr);
    const id_usuario = user.idUsuario || user.usuario?.id || user.id || null;

    try {
      // Verifica el código y registra al usuario
      if (code !== selectedPrivateEvent.codigo) {
        toast.error("Código incorrecto");
        return;
      }

      const actuales = conteoAsistentes[selectedPrivateEvent.id_evento] ?? 0;
      if (actuales >= selectedPrivateEvent.limite_usuarios) {
        toast.error("El evento ha alcanzado el límite de usuarios.");
        return;
      }

      await entry({
        id_usuario,
        id_evento: selectedPrivateEvent.id_evento,
        codigo: code // Envía el código al backend para validación adicional
      });

      toast.success("Inscripción exitosa");
      fetchEventosInscritos();

      setConteoAsistentes((prev) => ({
        ...prev,
        [selectedPrivateEvent.id_evento]: actuales + 1,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al inscribirte al taller");
    } finally {
      setPrivateEventModalOpen(false);
      setSelectedPrivateEvent(null); // Limpia el evento seleccionado
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

  const handleAsistenteEliminado = (id_evento) => {
    setConteoAsistentes((prev) => ({
      ...prev,
      [id_evento]: Math.max((prev[id_evento] ?? 1) - 1, 0)
    }));
  };

  const esEventoPrivado = (evento) => {
    return evento.tipo_evento === 'Privado' || evento.es_privado === true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Talleres</h1>
            <p className="text-gray-600 mt-2">
              Consulta o administra los talleres disponibles
              {esUsuarioAdmin() && (
                <span className="text-blue-600 font-medium"> • Vista de Administrador</span>
              )}
            </p>
          </div>
          {user.rol == 1 ? (
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleModal}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Taller
            </Button>
          ) : (
            <></>
          )}
        </div>

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
                  <SelectItem key={cat.id_categoria} value={String(cat.id_categoria)}>
                    {cat.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500">
              Cargando talleres...
            </div>
          ) : eventosFiltrados.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">
              No hay talleres para esta categoría.
            </div>
          ) : (
            eventosFiltrados.slice(0, visibleCount).map((evento) => {
              const inscrito = estaInscrito(evento.id_evento);
              const asistentesCount = conteoAsistentes[evento.id_evento] ?? 0;
              const fechaEvento = new Date(evento.fecha);
              const esPasado = isPastEvent(fechaEvento);
              const deshabilitarInscripcion = shouldDisableRegistration(fechaEvento) || inscrito;

              // Si el evento es pasado, lo marcamos como inactivo
              const estatus = esPasado ? false : evento.estatus;

              return (
                <Card key={evento.id_evento} className="hover:shadow-lg transition-shadow">
                  <CardHeader
                    onClick={() => {
                      if (user?.rol === 1 && evento.tipo_evento?.toLowerCase() === "privado") {
                        setSelectedEventCode(evento.codigo);
                        setCodeModalOpen(true);
                      }
                    }}
                    className={`${user?.rol === 1 && evento.tipo_evento?.toLowerCase() === "privado" ?
                      "cursor-pointer hover:bg-gray-50 rounded-t-lg" :
                      ""}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{evento.tipo_evento}</Badge>
                        {eventoPrivado && esUsuarioAdmin() && (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            <Lock className="w-3 h-3 mr-1" />
                            Privado
                          </Badge>
                        )}
                      </div>
                      <Badge
                        variant={estatus ? "default" : "destructive"}
                        className={estatus ? "bg-green-100 text-green-800" : ""}
                      >
                        {estatus ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{evento.nombre_evento}</CardTitle>
                    <CardDescription>{evento.lugar}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(evento.fecha + 'T00:00:00').toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{evento.lugar}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span
                          className={`${user?.rol === 1
                            ? "text-blue-600 cursor-pointer hover:underline"
                            : "text-gray-600 cursor-default"
                            }`}
                          onClick={() => {
                            if (user?.rol === 1) handleVerAsistentes(evento);
                          }}
                          title={user?.rol === 1 ? "Ver asistentes" : "Solo visible para administradores"}
                        >
                          {asistentesCount} / {evento.limite_usuarios} asistentes
                        </span>
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
                        disabled={inscrito || deshabilitarInscripcion}
                      >
                        {inscrito
                          ? "Inscrito"
                          : deshabilitarInscripcion
                            ? "Inscripciones cerradas"
                            : "Inscribirse al taller"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {visibleCount < eventos.length && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={handleVerMas}
          >
            Ver más
          </button>
        </div>
      )}

      <EventModal
        isOpen={isOpen}
        handleClose={handleClose}
        onEventoCreado={fetchEventos}
        isEditMode={isEditMode}
        eventoSeleccionado={eventoSeleccionado}
        categoriaSeleccionada={categoriaSeleccionada}
      />

      <AssistantsListModal
        isOpen={asistentesOpen}
        onClose={() => setAsistentesOpen(false)}
        evento={eventoActual}
        onAsistenteEliminado={handleAsistenteEliminado}
      />

      <CodeModal
        isOpen={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        eventCode={selectedEventCode}
      />

      <PrivateEventModal
        isOpen={privateEventModalOpen}
        onClose={() => {
          setPrivateEventModalOpen(false);
          setSelectedPrivateEvent(null); // Limpia al cerrar
        }}
        onConfirm={handlePrivateEventRegistration}
        eventName={selectedPrivateEvent?.nombre_evento || ''}
        key={selectedPrivateEvent?.id_evento || 'modal'} // Forza reinicio al cambiar evento
      />
    </div >
  );
};

export default EventList;