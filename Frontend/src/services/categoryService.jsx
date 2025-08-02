import axiosInstance from "./axiosInstance";

export const category = async ({nombre, descripcion, estatus=true}) => {

    try {
        const response = await axiosInstance.post('/api/categoria/save', {
            nombre,
            descripcion,
            estatus
        });
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/api/categoria/');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener categorías: ', error);
        throw error;
    }
}

export const editCategory = async ({ id, nombre, descripcion, estatus }) => {
    try {
        const response = await axiosInstance.put(`/api/categoria/update/${id}`, {
            nombre,
            descripcion,
            estatus
        });
        return response.data;
    } catch (error) {
        console.error("Error al editar categoría:", error);
        throw error;
    }
};