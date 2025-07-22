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

export const getEventosInscritos = async (id_usuario) => {
  try {
    const response = await axiosInstance.get(`/api/participantesevento/usuario/${id_usuario}`);
    console.log("Hola");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error al obtener eventos inscritos:', error);
    throw error;
  }
};
