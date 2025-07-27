import axiosInstance from "./axiosInstance"

export const getMovimientos = async () => {
    try {
        const response = await axiosInstance.get('/api/movimientos/');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los movimientos: ", error);
        throw error;
    }
}
