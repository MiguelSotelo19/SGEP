import axiosInstance from "./axiosInstance"

export const getEventos = async (id_categoria = null) => {
    try {
        const endpoint = id_categoria 
            ? `/api/talleres/?id_categoria=${id_categoria}`
            : '/api/talleres/';
        const response = await axiosInstance.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error al obtener los eventos: ", error);
        throw error;
    }
}

export const createEvent = async ({ nombre_evento, lugar, tipo_evento, fecha, estatus = true, limite_usuarios, id_categoria }) => {
    try {
        const response = await axiosInstance.post('/api/talleres/save', {
            nombre_evento,
            lugar,
            tipo_evento,
            fecha,
            estatus,
            limite_usuarios,
            id_categoria
        })
        return response.data.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const editEvent = async ({ id_evento, nombre_evento, lugar, tipo_evento, fecha, estatus, limite_usuarios, id_categoria }) => {
    try {
        const [responseUpdate, responseEstado] = await Promise.all([
            axiosInstance.put(`/api/talleres/update/${id_evento}`, {
                nombre_evento,
                lugar,
                tipo_evento,
                fecha,
                limite_usuarios,
                id_categoria
            }),
            axiosInstance.put(`/api/talleres/cambiarEstado/${id_evento}`,
                estatus,
            )
        ])

        return {
            update: responseUpdate.data.data,
            estado: responseEstado.data.data
        }
    } catch (error) {
        console.error("Error al editar taller (Promise.all):", error);
        throw error;
    }
}

export const deleteEvent = async ({ id_evento }) => {
    try {
        const response = await axiosInstance.delete(`/api/talleres/delete/${id_evento}`)
        return response.data.data
    } catch (error) {
        console.log(error)
        throw error
    }
}


