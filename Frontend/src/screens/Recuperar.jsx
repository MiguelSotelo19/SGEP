import { useState } from "react";
import axiosInstance from "../services/axiosInstance";

export const Recuperar = ({ setModo }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [correo, setCorreo] = useState("");

    const enviarCorreo = async () => {
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            Swal.fire({
                icon: "warning",
                title: "Correo inválido",
                text: "Por favor, ingresa un correo electrónico válido.",
            });
            return;
        }

        try {
            const response = await axiosInstance.post(`${API_URL}/mascotas/enviar_correo_recuperacion/`, {
                correo,
            });

            Swal.fire({
                icon: "success",
                title: "Correo Enviado",
                text: "Revisa tu bandeja de entrada (spam si es necesario)",
                timer: 2000,
                showConfirmButton: false,
            });

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "Error al enviar la solicitud.",
            });
        }
    };

    return (
        
        <>
            <h2 className="login-letra">Recuperar Contraseña</h2>
            <div className="inputBx login-letra">
                <label>Ingrese su correo electrónico</label>
            </div>
            <div className="inputBx login-letra">
                <input className="login-letra" type="email" placeholder="Correo electrónico" />
            </div>
            <div className="inputBx login-letra" >
                <input className="login-letra" type="submit" value="Enviar correo de recuperación" />
            </div>
            <div className="links">
                <button className="login-letra boton_login" onClick={() => setModo("login")} style={{ width: "100%" }}>Iniciar sesión</button>
            </div>
        </>
    )
}