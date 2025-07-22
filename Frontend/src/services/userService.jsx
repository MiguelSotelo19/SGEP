import axiosInstance from "./axiosInstance"

export const editUser = async (user) => {
    try {
        const endpoint = `/api/usuarios/${user.id}`;
        
        const userWithRolObject = {
            ...user,
            rol: {
                id_rol: user.rol 
            }
        };

        const response = await axiosInstance.put(endpoint, userWithRolObject);
        await getUser(user)
        return response.data.data;
    } catch (error) {
        console.error("Error al editar el usuario: ", error);
        throw error;
    }
}

export const getUser = async (user) => {
    try {
        const endpoint = `/api/usuarios/${user.id}`;
    
        const response = await axiosInstance.get(endpoint)
        console.log(response.data.data.data);
        const userId = {
            ...response.data.data.data,
            id: response.data.data.data.id_usuario
        }
        localStorage.setItem("User", JSON.stringify(userId));
    } catch (error) {
        console.error("Error al editar el usuario: ", error);
        throw error;
    }
}
