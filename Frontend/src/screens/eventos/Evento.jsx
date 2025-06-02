import { useState, useEffect } from "react";
import EstadoBadge from "../../components/EstadoBadge";
import axiosInstance from "../../services/axiosInstance";

const Evento = () => {
  const [showModal, setShowModal] = useState(false);
  const [eventos, setEventos] = useState();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nuevoEvento, setNuevoEvento] = useState({
    nombre_evento: "",
    lugar: "",
    fecha: "",
    limite_usuarios: "",
    id_categoria: "",
    tipo_evento: "",
  });

  useEffect(() => {
    cargarEventos();
    cargarCategorias();
  }, []);

  const cargarEventos = () => {
    axiosInstance
      .get("api/talleres/")
      .then((res) => {
        console.log("Eventos cargados:", res.data);
        setEventos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener los eventos:", err);
        setError("No se pudieron cargar los eventos.");
        setLoading(false);
      });
  };

  const cargarCategorias = () => {
    axiosInstance
      .get("/api/categoria/")
      .then((res) => {
        console.log("Categorías cargadas:", res.data.data.data);
        setCategorias(res.data.data.data);
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    // Validaciones con Regex
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
    const lugarRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
    const limiteUsuariosRegex = /^[1-9][0-9]*$/;
    const tipoEventoRegex = /^(Privado|Publico)$/;

    if (!nombreRegex.test(nuevoEvento.nombre_evento)) {
      alert("El nombre del evento debe tener al menos 3 letras y solo contener letras y espacios.");
      return;
    }

    if (!lugarRegex.test(nuevoEvento.lugar)) {
      alert("El lugar debe tener al menos 3 caracteres y solo contener letras, números y espacios.");
      return;
    }

    if (!nuevoEvento.fecha) {
      alert("Por favor, selecciona una fecha.");
      return;
    }

    const hoy = new Date();
    const fechaEvento = new Date(nuevoEvento.fecha);
    if (fechaEvento < hoy.setHours(0, 0, 0, 0)) {
      alert("La fecha no puede ser anterior a hoy.");
      return;
    }

    if (!limiteUsuariosRegex.test(nuevoEvento.limite_usuarios)) {
      alert("El límite de usuarios debe ser un número positivo mayor a 0.");
      return;
    }

    if (!tipoEventoRegex.test(nuevoEvento.tipo_evento)) {
      alert("Selecciona un tipo de evento válido.");
      return;
    }

    try {
      const response = await axiosInstance.post("api/talleres/save", {
        ...nuevoEvento,
        limite_usuarios: parseInt(nuevoEvento.limite_usuarios),
        id_categoria: parseInt(nuevoEvento.id_categoria),
      });

      console.log("Evento registrado:", response.data);
      alert("Evento registrado correctamente");

      setShowModal(false);
      setNuevoEvento({
        nombre_evento: "",
        lugar: "",
        fecha: "",
        limite_usuarios: "",
        id_categoria: "",
        tipo_evento: "",
      });

      cargarEventos();
    } catch (error) {
      console.error("Error al guardar evento:", error);
      alert("Hubo un error al registrar el evento. Verifica si tu sesión expiró o si el token es válido.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 mt-6">
        <h1 className="text-3xl font-bold">Eventos</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-100 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Nuevo Evento
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando eventos...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {eventos.map((event, index) => (
            <div
              key={event.id || index}
              className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {event.nombre_evento}
                </h2>
                <EstadoBadge estado={event.estatus ? "Activo" : "Inactivo"} />
              </div>
              <p className="text-gray-600 mb-1">Lugar: {event.lugar}</p>
              <p className="text-gray-600 mb-1">Fecha: {event.fecha}</p>
              <p className="text-gray-600 mb-1">
                Límite de usuarios: {event.limite_usuarios}
              </p>
              <p className="text-gray-600 mb-1">
                Categoría ID: {event.id_categoria}
              </p>
              <p className="text-gray-600">Tipo: {event.tipo_evento}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal para nuevo evento */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-center">Nuevo Evento</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="nombre_evento"
                placeholder="Nombre del evento"
                className="w-full border p-2 rounded"
                value={nuevoEvento.nombre_evento}
                onChange={handleChange}
              />
              <input
                type="text"
                name="lugar"
                placeholder="Lugar"
                className="w-full border p-2 rounded"
                value={nuevoEvento.lugar}
                onChange={handleChange}
              />
              <input
                type="date"
                name="fecha"
                className="w-full border p-2 rounded"
                value={nuevoEvento.fecha}
                onChange={handleChange}
              />
              <input
                type="number"
                name="limite_usuarios"
                placeholder="Límite de usuarios"
                className="w-full border p-2 rounded"
                value={nuevoEvento.limite_usuarios}
                onChange={handleChange}
              />

              <select
                name="id_categoria"
                className="w-full border p-2 rounded"
                value={nuevoEvento.id_categoria}
                onChange={handleChange}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat, index) => (
                  <option key={cat.id || index} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              <select
                name="tipo_evento"
                className="w-full border p-2 rounded"
                value={nuevoEvento.tipo_evento}
                onChange={handleChange}
              >
                <option value="">Tipo de evento</option>
                <option value="Privado">Privado</option>
                <option value="Publico">Público</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evento;
