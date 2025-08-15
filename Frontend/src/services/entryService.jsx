import axiosInstance from "./axiosInstance";

export const entry = async ({ id_usuario, id_evento, codigo }) => {
  try {
    const response = await axiosInstance.post('/api/participantesevento/', {
      id_usuario,
      id_evento,
      codigo
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


export const getAsistentesByEvento = async (id_evento) => {
  try {
    const response = await axiosInstance.get(`/api/participantesevento/asistentes/${id_evento}`);
    return response.data;
  } catch (error) {
    console.log('Error al obtener a los usuarios inscritos', error);
    throw error;
  }
};

export const deleteAsistentesByEvento = async ({ id_usuario, id_evento }) => {
  try {
    const response = await axiosInstance.delete(`/api/participantesevento/anularasistencia/${id_usuario}/${id_evento}`);
    return response.data;
  } catch (error) {
    console.log('Error al anular la asistencia del usuario')
    throw error;
  }
};
