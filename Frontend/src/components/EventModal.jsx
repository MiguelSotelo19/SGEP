import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { toast } from "react-toastify";
import { createEvent, editEvent } from "../services/eventService";
import { useParams } from "react-router-dom";


const EventModal = ({ isOpen, handleClose, onEventoCreado, isEditMode, eventoSeleccionado, categoriaSeleccionada }) => {

  const [minDate, setMinDate] = useState('');

  const [formData, setFormData] = useState({
    nombre_evento: '',
    lugar: '',
    tipo_evento: '',
    fecha: '',
    id_categoria: categoriaSeleccionada,
    limite_usuarios: 0
  });

  const [errors, setErrors] = useState({
    nombre_evento: '',
    lugar: '',
    tipo_evento: '',
    fecha: '',
    limite_usuarios: 0
  });

  const resetForm = () => {
    setFormData({
      nombre_evento: '',
      lugar: '',
      tipo_evento: '',
      fecha: '',
      id_categoria: categoriaSeleccionada,
      limite_usuarios: 0
    });
    setErrors({
      nombre_evento: '',
      lugar: '',
      tipo_evento: '',
      fecha: '',
      limite_usuarios: 0
    });
    setIsActivate(true);
  };

  const [isActivate, setIsActivate] = useState(true);

  const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]*$/;

  useEffect(() => {

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 2);
    setMinDate(tomorrow.toISOString().split('T')[0]);

    if (isEditMode && eventoSeleccionado) {
      setFormData({
        nombre_evento: eventoSeleccionado.nombre_evento || '',
        lugar: eventoSeleccionado.lugar || '',
        tipo_evento: eventoSeleccionado.tipo_evento?.toLowerCase() || '',
        fecha: eventoSeleccionado.fecha || '',
        id_categoria: eventoSeleccionado.id_categoria || categoriaSeleccionada,
        limite_usuarios: eventoSeleccionado.limite_usuarios || 0
      });
      setIsActivate(eventoSeleccionado.estatus);
    } else {
      resetForm();
    }
  }, [isEditMode, eventoSeleccionado, categoriaSeleccionada]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/\s{2,}/g, ' ');
    setFormData(prev => ({
      ...prev,
      [name]: cleanedValue
    }));
  };

  const handleActivate = () => setIsActivate(!isActivate);

  const validateFields = () => {
    let isValid = true;
    let tempErrors = {
      nombre_evento: '',
      lugar: '',
      tipo_evento: '',
      fecha: '',
      limite_usuarios: 0
    };

    if (!formData.nombre_evento.trim()) {
      tempErrors.nombre_evento = 'El nombre del evento es requerido';
      isValid = false;
    } else if (!textRegex.test(formData.nombre_evento)) {
      tempErrors.nombre_evento = 'Solo se permiten letras, números y espacios';
      isValid = false;
    } else if (formData.nombre_evento.length > 40) {
      tempErrors.nombre_evento = 'Máximo 40 caracteres permitidos';
      isValid = false;
    }

    if (!formData.lugar.trim()) {
      tempErrors.lugar = 'El lugar es requerido';
      isValid = false;
    } else if (formData.lugar.length > 80) {
      tempErrors.lugar = 'Máximo 80 caracteres permitidos';
      isValid = false;
    }


    if (!formData.tipo_evento) {
      tempErrors.tipo_evento = 'El tipo de evento es requerido';
      isValid = false;
    }

    if (!formData.fecha) {
      tempErrors.fecha = 'La fecha es requerida';
      isValid = false;
    } else {
      const selectedDate = new Date(formData.fecha);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        tempErrors.fecha = 'No se puede seleccionar una fecha pasada';
        isValid = false;
      } else if (selectedDate.toDateString() === today.toDateString()) {
        tempErrors.fecha = 'No se pueden crear o editar eventos con esa fecha';
        isValid = false;
      }
    }

    if (formData.tipo_evento === "publico") {
      if (!formData.limite_usuarios) {
        tempErrors.limite_usuarios = 'El límite de usuarios es requerido';
        isValid = false;
      } else if (isNaN(formData.limite_usuarios) || parseInt(formData.limite_usuarios) <= 0) {
        tempErrors.limite_usuarios = 'Debe ser un número mayor a 0';
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    const isValid = validateFields();

    if (isValid) {
      try {

        const cleanedFormData = {
          ...formData,
          nombre_evento: formData.nombre_evento.trim(),
          lugar: formData.lugar.trim(),
        };

        const payload = {
          ...cleanedFormData,
          id_categoria: parseInt(cleanedFormData.id_categoria),
          estatus: isActivate
        };

        if (isEditMode && eventoSeleccionado) {
          await editEvent({ ...payload, id_evento: eventoSeleccionado.id_evento });
          toast.success("Evento actualizado");
        } else {
          await createEvent(payload);
          toast.success("Evento creado");
          resetForm();
        }
        onEventoCreado?.();
        handleClose();
      } catch (error) {
        toast.error("Error en el servidor");
      }
    }
  };

  const mostrarLimiteUsuarios = !isEditMode && formData.tipo_evento === "publico";

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transition-all duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarDays className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Editar Evento' : 'Registrar Evento'}
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del evento</label>
            <input
              type="text"
              name="nombre_evento"
              value={formData.nombre_evento}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition ${errors.nombre_evento ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
            />
            {errors.nombre_evento && <p className="text-sm text-red-600 mt-1">{errors.nombre_evento}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
            <input
              type="text"
              name="lugar"
              value={formData.lugar}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition ${errors.lugar ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
            />
            {errors.lugar && <p className="text-sm text-red-600 mt-1">{errors.lugar}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de evento</label>
            <select
              name="tipo_evento"
              value={formData.tipo_evento}
              onChange={handleInputChange}
              disabled={isEditMode}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition
    ${errors.tipo_evento ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}
    ${isEditMode ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
  `}
              required
            >
              <option value="" disabled>Seleccione un tipo</option>
              <option value="privado">Privado</option>
              <option value="publico">Público</option>
            </select>
            {errors.tipo_evento && <p className="text-sm text-red-600 mt-1">{errors.tipo_evento}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              min={minDate}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition ${errors.fecha ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
            />
            {errors.fecha && <p className="text-sm text-red-600 mt-1">{errors.fecha}</p>}
          </div>

          {mostrarLimiteUsuarios && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Límite de usuarios</label>
              <input
                type="number"
                name="limite_usuarios"
                value={formData.limite_usuarios}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition ${errors.limite_usuarios ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
              />
              {/*{errors.limite_usuarios && <p className="text-sm text-red-600 mt-1">{errors.limite_usuarios}</p>}*/}
            </div>
          )}

          {isEditMode && (
            <label className="inline-flex items-center cursor-pointer mt-4">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isActivate}
                onChange={handleActivate}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 relative after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition peer-checked:after:translate-x-full" />
              <span className="ml-3 text-sm text-gray-700">Activo</span>
            </label>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                handleClose();
              }}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {isEditMode ? "Editar" : "Registrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default EventModal;