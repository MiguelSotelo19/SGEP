import { useEffect, useState } from "react";
import { Circulos } from "../components/Circulos";
import './css/login.css';
import { Login } from "./Login";
import { Recuperar } from "./Recuperar";
import { useNavigate } from "react-router-dom";

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
          ) : (
            <Recuperar setModo={setModo} />
          )}
        </div>
      </Circulos>
    </div>
  );
};