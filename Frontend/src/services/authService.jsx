import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const auth = async (correo, password) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/auth/signin`,
      data: {
        correo: correo,
        password: password,
      },
    });
    console.log("auth: ", response);

if (response.data.data && response.data.user) {
  const token = response.data.data;
  const user = response.data.user;

  localStorage.setItem("accessToken", token);

  localStorage.setItem(
    "user",
    JSON.stringify({
      idUsuario: user.id_usuario,
      correo: user.correo,
      nombre: user.nombre,
      apellido_paterno: user.apellido_paterno,
      apellido_materno: user.apellido_materno,
      telefono: user.telefono,
      estatus: user.estatus,
      limitefecha: user.limitefecha,
    })
  );
}


    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error("Error en autenticación:", error);
    return null;
  }
};
