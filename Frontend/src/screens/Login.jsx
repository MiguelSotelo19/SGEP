import { useState, useEffect } from "react";
import './css/login.css';

export const Login = () => {
    return (
        <>
            <div>
                <div className="ring">
                    <i style={{ "--clr": "#00ff0a" }}></i>
                    <i style={{ "--clr": "#ff0057" }}></i>
                    <i style={{ "--clr": "#fffd44" }}></i>
                    <div className="login">
                        <h2>Inicio de sesión</h2>
                        <div className="inputBx">
                            <input type="text" placeholder="Correo electrónico" />
                        </div>
                        <div className="inputBx">
                            <input type="password" placeholder="Contraseña" />
                        </div>
                        <div className="inputBx">
                            <input type="submit" value="Iniciar sesión" />
                        </div>
                        <div className="links">
                            <a href="#">Olvidé mi contraseña</a>
                            <a href="#">Registrarse</a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}