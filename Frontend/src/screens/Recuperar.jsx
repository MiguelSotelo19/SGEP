
export const Recuperar = ({ setModo }) => {
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
                <button className="login-letra" onClick={() => setModo("login")} style={{ width: "100%" }}>Iniciar sesión</button>
            </div>
        </>
    )
}