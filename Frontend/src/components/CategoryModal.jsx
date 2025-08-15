import { Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { category, editCategory } from "../services/categoryService";
import { toast } from "react-toastify";

const CategoryModal = ({ isOpen, handleClose, onCategoriaCreada, isEditMode, categoriaSeleccionada }) => {

    useEffect(() => {
    if (isOpen) {
        if (isEditMode && categoriaSeleccionada) {
            setFormData({
                nombre: categoriaSeleccionada.nombre || '',
                descripcion: categoriaSeleccionada.descripcion || '',
            });
            setIsActivate(categoriaSeleccionada.estatus);
        } else {
            // Modo creación: limpiar el formulario
            setFormData({
                nombre: '',
                descripcion: ''
            });
            setIsActivate(true);
            setErrors({
                nombre: '',
                descripcion: ''
            });
        }
    }
}, [isOpen, isEditMode, categoriaSeleccionada]);


    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: ''
    });

    const [isActivate, setIsActivate] = useState(true);

    const textOnlyRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

    const validateFields = () => {
        let tempErrors = {
            nombre: '',
            descripcion: ''
        };

        if (!formData.nombre.trim()) {
            tempErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length > 20) {
            tempErrors.nombre = 'El nombre no puede exceder los 20 caracteres';
        } else if (!textOnlyRegex.test(formData.nombre)) {
            tempErrors.nombre = 'Solo se permiten letras y espacios';
        }

        if (!formData.descripcion.trim()) {
            tempErrors.descripcion = 'La descripción es requerida';
        } else if (formData.descripcion.length > 50) {
            tempErrors.descripcion = 'La descripción no puede exceder los 50 caracteres';
        } else if (!textOnlyRegex.test(formData.descripcion)) {
            tempErrors.descripcion = 'Solo se permiten letras';
        }

        setErrors(tempErrors);
        return Object.values(tempErrors).every(error => error === '');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const cleanedValue = value.replace(/\s{2,}/g, ' ');
        setFormData(prev => ({
            ...prev,
            [name]: cleanedValue
        }));
    };

    const handleActivate = () => setIsActivate(!isActivate);

    const handleSubmit = async () => {
        if (validateFields()) {
            try {
                if (isEditMode && categoriaSeleccionada) {
                    const response = await editCategory({
                        id: categoriaSeleccionada.id_categoria,
                        nombre: formData.nombre.trim(),
                        descripcion: formData.descripcion.trim(),
                        estatus: isActivate,
                    });
                    toast.success("Categoría actualizada");
                } else {
                    const response = await category({
                        nombre: formData.nombre.trim(),
                        descripcion: formData.descripcion.trim(),
                    });
                    toast.success("Categoría creada");
                }

                onCategoriaCreada && onCategoriaCreada();
                handleClose();

            } catch (error) {
                if (error.response?.status === 400) {
                    toast.warn('El nombre de la categoría ya está registrado');
                } else {
                    toast.error('Error en el servidor');
                }
            }
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transition-all duration-300">

                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Tag className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {isEditMode ? 'Editar Categoría' : 'Registrar Categoría'}
                                </h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de la categoría
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Electrónicos, Ropa, Hogar..."
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors duration-200 ${errors.nombre
                                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                                        }`}
                                />
                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Describe brevemente esta categoría..."
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 transition-colors duration-200 ${errors.descripcion
                                        ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400'
                                        }`}
                                />
                                {errors.descripcion && (
                                    <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
                                )}
                            </div>

                            {isEditMode ? (

                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" class="sr-only peer" checked={isActivate} onChange={handleActivate} />
                                    <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-600">Activa</span>
                                </label>

                            ) : null}


                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg"
                                >
                                    {isEditMode ? 'Editar' : 'Registrar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CategoryModal;
