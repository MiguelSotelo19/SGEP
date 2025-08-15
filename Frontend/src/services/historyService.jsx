import axiosInstance from "./axiosInstance"

export const getMovimientos = async () => {
    try {
        const response = await axiosInstance.get('/api/movimientos/');
        return response.data;
    } catch (error) {
        throw error;
    }
}
