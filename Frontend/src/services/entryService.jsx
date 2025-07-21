import axiosInstance from "./axiosInstance";

export const entry = async ({ id_usuario, id_evento }) => {
  try {
    const response = await axiosInstance.post('/api/participantesevento/', {
      id_usuario,
      id_evento
    });
    return response.data.data;
 
  } catch (error) {
    console.error('Error al inscribir usuario al taller:', error);
    throw error;
  }
};
