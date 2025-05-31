import { useState } from "react";
import { Circulos } from "../components/Circulos";
import './css/login.css';
import { Login } from "./Login";
import { Recuperar } from "./Recuperar";

export const LoginHub = () => {
    const [modo, setModo] = useState("login");

  return (
    <div className="login-page">
      <Circulos>
        <div className="login">
          {modo === "login" ? (
            <Login setModo={setModo}/>
          ) : (
            <Recuperar setModo={setModo}/>
          )}
        </div>
      </Circulos>
    </div>
  );
};