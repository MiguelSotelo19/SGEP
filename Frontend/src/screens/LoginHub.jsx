import { useEffect, useState } from "react";
import { Circulos } from "../components/Circulos";
import './css/login.css';
import { Login } from "./Login";
import { Recuperar } from "./Recuperar";
import { useNavigate } from "react-router-dom";
import { Registro } from "./Registro";

export const LoginHub = () => {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login");
  const isAuthenticated = () => {
    return !!sessionStorage.getItem("usuario");
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/categories", { replace: true });
    }
  }, []);
  return (
    <div className="login-page">
      <Circulos>
        <div className="login">
          {modo === "login" ? (
            <Login setModo={setModo} />
          ) : modo === "recuperar" ? (
            <Recuperar setModo={setModo} />
          ) : (
            <Registro setModo={setModo} />
          )}
        </div>

      </Circulos>
    </div>
  );
};