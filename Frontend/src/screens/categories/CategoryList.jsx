import { useEffect, useState } from "react";
import Category from "../../components/Category";
import CategoryModal from "../../components/CategoryModal";
import { ToastContainer, toast } from "react-toastify";
import { getCategories } from "../../services/categoryService";


const CategoryList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const handleModal = () => setIsOpen(true);

    const handleClose = () => {
        setIsOpen(false);
        setIsEditMode(false);
    }

    const handleEditMode = (categoria) => {
        setIsEditMode(true);
        setCategoriaSeleccionada(categoria);
        setIsOpen(true);
    };

    const fetchCategorias = async () => {
        try {
            const data = await getCategories();
            setCategorias(data.data);
        } catch (error) {
            toast.error("Error al cargar las categorías: ", error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);


    return (
        <div className="p-6 max-w-5xl mx-auto">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6 mt-6">
                <h1 className="text-3xl font-bold">Categorías de talleres</h1>
                <button
                    onClick={handleModal}
                    className="bg-gray-100 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer">
                    Nueva Categoría
                </button>
            </div>
            <div className="border-b-2 border-gray-200 mb-5"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categorias.map((cat, index) => (
                    <Category
                        key={index}
                        id_categoria={cat.id_categoria}
                        nombre={cat.nombre}
                        descripcion={cat.descripcion}
                        estado={cat.estatus ? "Activo" : "Inactivo"}
                        onEditMode={() => handleEditMode(cat)}
                    />
                ))}
            </div>
            <CategoryModal
                isOpen={isOpen}
                handleClose={handleClose}
                onCategoriaCreada={fetchCategorias}
                isEditMode={isEditMode}
                categoriaSeleccionada={categoriaSeleccionada}
            />
        </div>
    )
}

export default CategoryList