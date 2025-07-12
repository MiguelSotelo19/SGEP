import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getCategories } from "../../services/categoryService";

import { Navigation } from "../../components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/button";
import { Plus, Calendar, Users, Music, Briefcase, Heart, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

import CategoryModal from "../../components/CategoryModal";

const iconMap = {
  Música: Music,
  Negocios: Briefcase,
  Deportes: Users,
  "Arte y Cultura": Heart,
  Tecnología: Gamepad2,
  Entretenimiento: Calendar,
};

const colorMap = {
  Música: "bg-purple-100 text-purple-600",
  Negocios: "bg-blue-100 text-blue-600",
  Deportes: "bg-green-100 text-green-600",
  "Arte y Cultura": "bg-pink-100 text-pink-600",
  Tecnología: "bg-orange-100 text-orange-600",
  Entretenimiento: "bg-yellow-100 text-yellow-600",
};

const CategoryList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const navigate = useNavigate();

  const handleModal = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setIsEditMode(false);
  };

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
      toast.error("Error al cargar las categorías");
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const showEvents = (cat) => {
    navigate("/events", {
      state: {
        id_categoria: cat.id_categoria,
        nombre: cat.nombre
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorías de talleres</h1>
            <p className="text-gray-600 mt-2">Explora o administra categorías disponibles</p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleModal}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((cat) => {
            const Icon = iconMap[cat.nombre] || Calendar;
            const color = colorMap[cat.nombre] || "bg-gray-100 text-gray-600";
            return (
              <Card key={cat.id_categoria} className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader onClick={() => showEvents(cat)}>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary">{cat.estatus ? "Activo" : "Inactivo"}</Badge>
                  </div>
                  <CardTitle className="text-xl">{cat.nombre}</CardTitle>
                  <CardDescription>{cat.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => handleEditMode(cat)}>
                    Editar Categoría
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <CategoryModal
        isOpen={isOpen}
        handleClose={handleClose}
        onCategoriaCreada={fetchCategorias}
        isEditMode={isEditMode}
        categoriaSeleccionada={categoriaSeleccionada}
      />
    </div>
  );
};

export default CategoryList;
