import { useState } from "react";
import { Circulos } from "../components/Circulos";
import './css/login.css';

export const Login = () => {
    const [modo, setModo] = useState("login");

  return (
    <div className="login-page">
      <Circulos>
        <div className="login">
          {modo === "login" ? (
            <>
              <h2>Inicio de sesión</h2>
              <div className="inputBx">
                <input type="email" placeholder="Correo electrónico" />
              </div>
              <div className="inputBx">
                <input type="password" placeholder="Contraseña" />
              </div>
              <div className="inputBx">
                <input type="submit" value="Iniciar sesión" />
              </div>
              <div className="links">
                <button onClick={() => setModo("recuperar")}>Olvidé mi contraseña</button>
                <a href="#">Registrarse</a>
              </div>
            </>
          ) : (
            <>
              <h2>Recuperar Contraseña</h2>
              <div className="inputBx">
                <label>Ingrese su correo electrónico</label>
              </div>
              <div className="inputBx">
                <input type="email" placeholder="Correo electrónico" />
              </div>
              <div className="inputBx">
                <input type="submit" value="Enviar correo de recuperación" />
              </div>
              <div className="links">
                <button onClick={() => setModo("login")} style={{width:"100%"}}>Iniciar sesión</button>
              </div>
            </>
          )}
        </div>
      </Circulos>
    </div>
  );
};