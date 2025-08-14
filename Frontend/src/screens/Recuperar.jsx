import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const Recuperar = ({ setModo }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlCorreo = `${API_URL}/api/usuarios/verify`;
    const urlCodigo = `${API_URL}/api/usuarios/verify/code`;
    const urlCambioContra = `${API_URL}/api/usuarios/verify/reset`;
    const navigate = useNavigate();
    const [tiempoRestante, setTiempoRestante] = useState(300);
    const [paso, setPaso] = useState(1);
    const [correo, setCorreo] = useState("");
    const [codigo, setCodigo] = useState("");
    const [password, setPassword] = useState("");

    
    const enviarCorreo = async () => {
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correo)) {
            return Swal.fire({
                icon: "warning",
                title: "Correo inválido",
                text: "Por favor, ingresa un correo electrónico válido.",
            });
        }

        try {
            const response = await axios.post(urlCorreo, { correo });
            if (response) {
                Swal.fire({
                    icon: "success",
                    title: "Correo enviado",
                    text: "Revisa tu bandeja de entrada o spam. El código expira en 5 minutos.",
                });
                setPaso(2);
            }

        } catch (err) {
            if (err.response?.status === 404) {
                Swal.fire({
                    icon: "warning",
                    title: "Correo no encontrado",
                    text: "Este correo no está registrado.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al enviar",
                    text: "Intenta de nuevo más tarde.",
                });
            }
        }
    }

    const verificarCodigo = async () => {
        if (!codigo.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Código requerido",
                text: "Por favor, ingresa el código recibido por correo.",
            });
            return;
        }

        try {
            await axios.post(urlCodigo, { correo, codigo });
            Swal.fire({
                icon: "success",
                title: "Código verificado",
                text: "Ahora puedes establecer una nueva contraseña.",
            });
            setPaso(3);
        } catch (err) {
            if (err.response?.status === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Código inválido o expirado",
                    text: "Tu código es incorrecto o ya expiró. Solicita uno nuevo.",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al verificar",
                    text: "Revisa el código y vuelve a intentarlo.",
                });
            }
        }
    };

    const resetPassword = async () => {
        if (!password.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Contraseña requerida",
                text: "Por favor, ingresa una nueva contraseña.",
            });
            return;
        }

        try {
            await axios.put(urlCambioContra, {
                correo, codigo, password
            });

            Swal.fire({
                icon: "success",
                title: "Contraseña actualizada",
                text: "Ya puedes iniciar sesión con tu nueva contraseña.",
            });
            navigate("/");
            setModo("login");
            limpiar();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error al reestablecer",
                text: "Verifica que el código sea válido.",
            });
        }
    };

    useEffect(() => {
        let intervalo;

        if (paso === 2) {
            setTiempoRestante(300);

            intervalo = setInterval(() => {
                setTiempoRestante(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalo);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalo);
    }, [paso]);

    const formatoTiempo = (segundos) => {
        const min = String(Math.floor(segundos / 60)).padStart(2, '0');
        const sec = String(segundos % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    function limpiar() {
        setTiempoRestante(300);
        setPaso(1);
        setCodigo("");
        setCorreo("");
        setPassword("");
    }

    return (

        <>
            <h2 className="login-letra">Recuperar Contraseña</h2>
            {paso === 1 && (
                <>
                    <div className="inputBx login-letra">
                        <label style={{fontSize:"17px"}}>Ingresa tu correo electrónico</label>
                        <input className="login-letra" type="email" placeholder="Correo electrónico"
                            value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    </div>
                    <div className="inputBx login-letra">
                        <input className="login-letra" type="submit"
                            value="Enviar código" onClick={enviarCorreo} />
                    </div>
                </>
            )}

            {paso === 2 && (
                <>
                    <p className="login-letra" style={{alignContent:"center"}}>
                        Se envió un código a tu correo. <br/>  Expira en: <strong>{formatoTiempo(tiempoRestante)}</strong>
                    </p>
                    <div className="inputBx login-letra">
                        <label>Ingresa el código recibido</label>
                        <input className="login-letra" type="text" placeholder="Código"
                            value={codigo} onChange={(e) => setCodigo(e.target.value)}
                        />
                    </div>
                    <div className="inputBx login-letra">
                        <input className="login-letra" type="submit"
                            value="Verificar código" onClick={verificarCodigo}
                        />
                    </div>
                </>
            )}

            {paso === 3 && (
                <>
                    <div className="inputBx login-letra">
                        <label>Ingresa tu nueva contraseña</label>
                        <input className="login-letra" type="password" placeholder="Nueva contraseña"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="inputBx login-letra">
                        <input className="login-letra" type="submit"
                            value="Reestablecer contraseña" onClick={resetPassword} />
                    </div>
                </>
            )}

            <div className="links">
                <button className="login-letra boton_login" onClick={() =>{ setModo("login"); limpiar()}} style={{ width: "100%" }}>
                    Volver al inicio
                </button>
            </div>
        </>
    )
}