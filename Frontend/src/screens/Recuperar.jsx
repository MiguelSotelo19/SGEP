
export const Recuperar = ({ setModo }) => {
    return (
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
                <button onClick={() => setModo("login")} style={{ width: "100%" }}>Iniciar sesión</button>
            </div>
        </>
    )
}