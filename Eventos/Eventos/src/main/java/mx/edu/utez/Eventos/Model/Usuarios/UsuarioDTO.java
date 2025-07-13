package mx.edu.utez.Eventos.Model.Usuarios;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mx.edu.utez.Eventos.Model.Roles.RolBean;

public class UsuarioDTO {
    @NotBlank(groups = {Register.class, Modify.class})
    private String nombre;
    @NotBlank(groups = {Register.class, Modify.class})
    private String apellido_paterno;
    @NotBlank(groups = {Register.class, Modify.class})
    private String apellido_materno;
    @NotBlank(groups = {Register.class, Modify.class})
    private String correo;
    @NotBlank(groups = {Register.class, Modify.class})
    private String telefono;
    @NotBlank(groups = {Register.class, Modify.class})
    private String password;
    @NotNull(groups = {Register.class, Modify.class})
    private Boolean estatus;
    @NotNull(groups = {Register.class})
    private RolBean rol;

    public UsuarioDTO() {
    }

    public UsuarioDTO(String nombre, String apellido_paterno, String apellido_materno, String correo, String telefono, String password, Boolean estatus, RolBean rol) {
        this.nombre = nombre;
        this.apellido_paterno = apellido_paterno;
        this.apellido_materno = apellido_materno;
        this.correo = correo;
        this.telefono = telefono;
        this.password = password;
        this.estatus = estatus;
        this.rol = rol;
    }

    public UsuarioBean toEntity(){
        return new UsuarioBean(nombre, apellido_paterno, apellido_materno, correo, telefono, password, estatus, rol);
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido_paterno() {
        return apellido_paterno;
    }

    public void setApellido_paterno(String apellido_paterno) {
        this.apellido_paterno = apellido_paterno;
    }

    public String getApellido_materno() {
        return apellido_materno;
    }

    public void setApellido_materno(String apellido_materno) {
        this.apellido_materno = apellido_materno;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public RolBean getRol() {
        return rol;
    }

    public void setRol(RolBean rol) {
        this.rol = rol;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public interface Register{}

    public interface Modify{}


}
