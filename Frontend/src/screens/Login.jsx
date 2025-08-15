import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/authService";
import axiosInstance from "../services/axiosInstance";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const Login = ({ setModo }) => {
    let urlUser = `${API_URL}/api/usuarios/`;
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [intentosRestantes, setIntentosRestantes] = useState(3);
    const [bloqueado, setBloqueado] = useState(false);

    const getUsers = async (correo) => {
        try {
           
            const response = await axiosInstance.get(urlUser)
           
            const users = response.data.data.data
            const user = users.find((u) => u.correo === correo)

            if (user) {
                localStorage.setItem("correo", correo)
                sessionStorage.setItem("usuario", JSON.stringify(user))
                return true
            } else {
                Swal.fire({
                    icon: "error",
                    title: "No se encontró usuario",
                    text: "El usuario ingresado no está registrado.",
                })
                return false
            }
        } catch (error) {

            if (error.response?.status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Sesión expirada",
                    text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
                })
            }

            return false
        }
    }


    const login = async (e) => {
        e.preventDefault()
        if (bloqueado) return;
        const correoLogin = correo.trim().toLowerCase()
        const passwordLogin = password.trim()
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

        if (!correoLogin || !passwordLogin) {
            Swal.fire({
                icon: "warning",
                title: "Campos vacíos",
                text: "Por favor, ingresa tu correo y contraseña.",
            });
            return;
        }

        if (!regexCorreo.test(correoLogin)) {
            Swal.fire({
                icon: "warning",
                title: "Correo electrónico inválido",
                text: "El correo electrónico debe de ser uno válido.",
            });
            return;
        }

        if (!regexPassword.test(passwordLogin)) {
            Swal.fire({
                icon: "warning",
                title: "Contraseña inválida",
                text: "La contraseña debe tener al menos 6 carácteres, una mayuscula y un carácter especial",
            });
            return;
        }

        try {
            const bloqueoResponse = await axios.get(`${urlUser}consultar-bloqueo/${correoLogin}`);

            const limiteBloqueo = bloqueoResponse.data.data;

            if (limiteBloqueo) {
                const ahora = new Date();
                const fechaBloqueo = new Date(limiteBloqueo);

                if (fechaBloqueo > ahora) {
                    setBloqueado(true);
                    const minutosRestantes = Math.ceil((fechaBloqueo - ahora) / 60000);
                    Swal.fire({
                        icon: "error",
                        title: "Usuario bloqueado",
                        text: `Tu cuenta está bloqueada por ${minutosRestantes} minutos.`,
                    });
                    return;
                }
            }
        } catch (err) {
            throw error;
        }

        try {
            const respuesta = await auth(correoLogin, passwordLogin)
            if (!respuesta || !respuesta.data) {
                setIntentosRestantes((prev) => prev - 1)

                if (intentosRestantes <= 1) {
                    toast.error(`Has excedido el número de intentos permitidos. Intente dentro de media hora`);
                    setBloqueado(true);
                    try {
                        await axios.post(`${urlUser}bloquear/${correoLogin}`);
                    } catch (error) {
                        throw error;    
                    }
                    return
                }

                toast.warn(`Credenciales incorrectas. Te quedan ${intentosRestantes - 1} intentos.`);
                return
            }

            await new Promise((resolve) => setTimeout(resolve, 100))

            const usuarioEncontrado = await getUsers(correo)

            if (!usuarioEncontrado) {
                Swal.fire({
                    icon: "error",
                    title: "Usuario no encontrado",
                    text: "El usuario no está registrado.",
                })
                return
            }

            Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                text: "Bienvenido",
            }).then(() => {
                limpiar()
                setIntentosRestantes(3)
                navigate("/categories")
            })
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error durante el inicio de sesión.",
            })
        }
    }

    function limpiar() {
        setCorreo("");
        setPassword("");

    }

    return (
        <>
            <ToastContainer />
            <h2 className="login-letra">Inicio de sesión</h2>
            <div className="inputBx login-letra">
                <input type="email" placeholder="Correo electrónico"
                    value={correo} disabled={bloqueado} onChange={(e) => setCorreo(e.target.value)} />
            </div>
            <div className="inputBx login-letra">
                <input className="login-letra" type="password" placeholder="Contraseña"
                    value={password} disabled={bloqueado} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="inputBx login-letra">
                <input className="login-letra" type="submit"
                    onClick={login} value="Iniciar sesión" disabled={bloqueado}
                />
            </div>

            <div className="links">
                <a onClick={() => { setModo("recuperar"); limpiar(); }} className="login-letra boton_login">Olvidé mi contraseña</a>
                <a onClick={() => { setModo("registrar"); limpiar(); }} className="login-letra boton_login">Registrarse</a>
            </div>
        </>
    );
};
