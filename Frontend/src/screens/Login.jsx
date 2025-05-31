
export const Login = ({ setModo }) => {
    return (
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
    )
}