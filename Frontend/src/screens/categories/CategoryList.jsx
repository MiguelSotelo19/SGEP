import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getCategories } from "../../services/categoryService";

import { Navigation } from "../../components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Plus, Calendar, Users, Search, Music, Briefcase, Heart, Gamepad2 } from "lucide-react";


import CategoryModal from "../../components/CategoryModal";
import "../css/main.css";

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
  const user = JSON.parse(localStorage.getItem("User"));
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState(""); 
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

   const [visibleCount, setVisibleCount] = useState(6);

  const handleVerMas = () => {
    setVisibleCount((prev) => prev + 6);
  };


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
      setCategoriasFiltradas(data.data);
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

  useEffect(() => {
    const resultados = categorias.filter(cat =>
      cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cat.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
    setCategoriasFiltradas(resultados);
  }, [busqueda, categorias]);


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
          {(user.rol == 1) ? (
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleModal}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          ) : (<></>)}          
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input className="pl-10" placeholder="Buscar categorías" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {categoriasFiltradas.slice(0, visibleCount).map((cat) => {
    const Icon = iconMap[cat.nombre] || Calendar;
    const color = colorMap[cat.nombre] || "bg-gray-100 text-gray-600";
    return (
      <Card key={cat.id_categoria} className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader onClick={() => showEvents(cat)}>
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <Badge
              variant={cat.estatus ? "default" : "destructive"}
              className={cat.estatus ? "bg-green-100 text-green-800" : ""}
            >
              {cat.estatus ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <CardTitle className="text-xl">{cat.nombre}</CardTitle>
          <CardDescription>{cat.descripcion}</CardDescription>
        </CardHeader>
        <CardContent>
          {user.rol == 1 ? (
            <div className="flex items-center justify-between">
              <Button variant="outline" className="action bg-transparent" onClick={() => handleEditMode(cat)}>
                Editar Categoría
              </Button>
              <Button variant="outline" className="action w-50 princ" onClick={() => showEvents(cat)}>
                Ver talleres
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="action w-full princ" onClick={() => showEvents(cat)}>
              Ver talleres
            </Button>
          )}
        </CardContent>
      </Card>
    );
  })}
</div>
{visibleCount < categoriasFiltradas.length && (
  <div className="flex justify-center mt-6">
    <Button
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
      onClick={handleVerMas}
    >
      Ver más
    </Button>
  </div>
)}


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