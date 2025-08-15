import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/authService";
import axiosInstance from "../services/axiosInstance";
import Swal from "sweetalert2";
import axios from "axios";

export const Registro = ({ setModo }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlRegistro = `${API_URL}/api/usuarios/registro`
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    let nombreLimpio = "";
    const [ap_p, setAp_p] = useState("");
    let ap_pLimpio = "";
    const [ap_m, setAp_m] = useState("");
    let ap_mLimpio = "";
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [password, setPassword] = useState("");

    const [paso, setPaso] = useState(1);

    const paso2 = async () => {

        const regex = /^(?!.*  )[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;

        function esValido(cadena) {
            const soloLetras = cadena.replace(/ /g, "");
            return regex.test(cadena.trim()) && soloLetras.length >= 3;
        }

        if (!esValido(nombre.trim()) || !esValido(ap_m.trim()) || !esValido(ap_p.trim())) {
            Swal.fire({
                icon: "warning",
                title: "Campos inválidos",
                text: "Por favor, verifica que ningun campo cuente con espacios dobles ni contenga números.",
            });
            return;
        }

        if (!regex.test(nombre.trim())) {
            Swal.fire({
                icon: "warning",
                title: "Nombre inválido",
                text: "Por favor, ingresa un nombre válido.",
            });
            return;
        }
        if (!regex.test(ap_p.trim())) {
            Swal.fire({
                icon: "warning",
                title: "Apellido paterno inválido",
                text: "Por favor, ingresa un apellido paterno válido.",
            });
            return;
        }
        if (!regex.test(ap_m.trim())) {
            Swal.fire({
                icon: "warning",
                title: "Apellido materno inválido",
                text: "Por favor, ingresa un apellido materno válido.",
            });
            return;
        }
        try { //está chiquito, es su primer dia siendo un try catch, no le hablen feo
            setPaso(2);
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "Algo ha ocurrido",
                text: "Intentelo de nuevo mas tarde.",
            });
        }
    }

    const registrar = async () => {
        const correoLimpio = correo.trim();
        const telefonoLimpio = telefono.toString().trim();
        const passwordLimpio = password.trim();

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexTelefono = /^[\d]{10}$/;
        const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

        if (!regexCorreo.test(correoLimpio)) {
            return Swal.fire({
                icon: "warning",
                title: "Correo inválido",
                text: "Por favor, ingresa un correo electrónico válido.",
            });
        }

        if (!regexTelefono.test(telefonoLimpio)) {
            return Swal.fire({
                icon: "warning",
                title: "Teléfono inválido",
                text: "Por favor, ingresa un número válido de 10 dígitos.",
            });
        }

        if (!regexPassword.test(passwordLimpio)) {
            return Swal.fire({
                icon: "warning",
                title: "Contraseña inválida",
                text: "La contraseña debe tener al menos 6 caracteres, una mayúscula y un carácter especial.",
            });
        }

        try {

            const parametros = {
                nombre: nombre.trim(),
                apellido_paterno: ap_p.trim(),
                apellido_materno: ap_m.trim(),
                correo: correoLimpio,
                telefono: telefonoLimpio,
                password: passwordLimpio,
                estatus: true,
                rol: {
                    id_rol: 2
                }
            };
            const respuesta = await axios.post(urlRegistro, parametros);
            if (respuesta.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Registro exitoso",
                    text: "¡Usuario registrado correctamente!",
                });
                navigate("/");
                setModo("login");
                limpiar();
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Algo salió mal. Intenta más tarde.",
            });
        }
    };

    function limpiar() {
        setNombre("");
        setAp_m("");
        setAp_p("");
        setTelefono("");
        setCorreo("");
        setPassword("");
        nombreLimpio = "";
        ap_mLimpio = "";
        ap_pLimpio = "";
    }

    return (
        <>
            <ToastContainer />
            <div className="small-inputs">
                <h2 className="login-letra">Registrar cuenta</h2>

                {paso === 1 && (
                    <>
                        <div className="inputBx login-letra" >
                            <input type="text" placeholder="Nombre"
                                value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        </div>

                        <div style={{ display: "flex", gap: "1rem", width: "100%", marginBottom: "1rem" }}>
                            <div className="inputBx login-letra" style={{ flex: 1 }}>
                                <input type="text" style={{ padding: "7%" }} placeholder="Apellido paterno"
                                    value={ap_p} onChange={(e) => setAp_p(e.target.value)} />
                            </div>
                            <div className="inputBx login-letra" style={{ flex: 1 }}>
                                <input type="text" style={{ padding: "7%" }} placeholder="Apellido materno"
                                    value={ap_m} onChange={(e) => setAp_m(e.target.value)} />
                            </div>
                        </div>

                        <div className="inputBx">
                            <input className="login-letra" type="submit"
                                onClick={paso2} value="Siguiente" />
                        </div>
                    </>
                )}

                {paso === 2 && (
                    <>
                        <div className="inputBx login-letra">
                            <input type="email" placeholder="Correo electrónico"
                                value={correo} onChange={(e) => setCorreo(e.target.value)} />
                        </div>

                        <div style={{ display: "flex", gap: "1rem", width: "100%", marginBottom: "1rem" }}>
                            <div className="inputBx login-letra" >
                                <input type="number" style={{ padding: "7%" }} placeholder="Núm. de teléfono"
                                    value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                            </div>
                            <div className="inputBx login-letra" >
                                <input type="password" style={{ padding: "7%" }} placeholder="Contraseña"
                                    value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <div className="inputBx login-letra">
                            <input className="login-letra" type="submit"
                                onClick={registrar} value="Registrar mi cuenta" />
                        </div>
                    </>
                )}

                <div className="links">
                    <a onClick={() => { setModo("recuperar"); limpiar(); }} className="login-letra boton_login">Olvidé mi contraseña</a>
                    <a onClick={() => { setModo("login"); limpiar(); }} className="login-letra boton_login">Iniciar sesión</a>
                </div>
            </div>


        </>
    )
}