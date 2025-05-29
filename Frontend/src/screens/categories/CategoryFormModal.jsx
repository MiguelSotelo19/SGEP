import '../css/categoryForm.css';

const CategoryFormModal = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto relative">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            type="button"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-800 pr-8">
            Crear nueva categoría
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre:
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Festivo"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción:
              </label>
              <textarea
                name="descripcion"
                placeholder="Ingresa una descripción"
                rows="3"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado:
              </label>
              <select
                name="estado"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryFormModal