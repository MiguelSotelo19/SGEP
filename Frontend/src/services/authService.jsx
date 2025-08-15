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
    })

    if (response.data.data) {
      localStorage.setItem("accessToken", response.data.data);
      localStorage.setItem("User", JSON.stringify(response.data.user));
    }

    return {
      data: response.data,
      status: response.status
    };
    
  } catch (error) {
    return null
  }
}