import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const auth = async (correo, password) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/auth/signin`,
      data: {
        correo: correo,
        password: password
      }
    });

    if (response.data.data) {
      localStorage.setItem("accessToken", response.data.data);
    }

    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};
