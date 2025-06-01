package mx.edu.utez.Eventos.Model.Usuarios;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;
import mx.edu.utez.Eventos.Model.Roles.RolBean;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")

public class UsuarioBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_usuario;

    @Column(length = 100)
    private String nombre;

    @Column(length = 100)
    private String apellido_paterno;

    @Column(length = 100)
    private String apellido_materno;

    @Column(length = 50, unique = true)
    private String correo;

    @Column(length = 10, unique = true)
    private String telefono;

    @Column(columnDefinition = "TEXT")
    private String password;

    @Column
    private Boolean estatus;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol")
    private RolBean rolBean;

    @ManyToMany(mappedBy = "usuarios", fetch = FetchType.LAZY)
    private Set<EventosBean> eventos = new HashSet<>();


    public UsuarioBean(String nombre, String apellido_paterno, String apellido_materno, String correo, String telefono, String password, Boolean estatus, RolBean rolBean) {
        this.nombre = nombre;
        this.apellido_paterno = apellido_paterno;
        this.apellido_materno = apellido_materno;
        this.correo = correo;
        this.telefono = telefono;
        this.password = password;
        this.estatus = estatus;
        this.rolBean = rolBean;
    }

    public UsuarioBean() {

    }

    public Long getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(Long id_usuario) {
        this.id_usuario = id_usuario;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public RolBean getRolBean() {
        return rolBean;
    }

    public void setRolBean(RolBean rolBean) {
        this.rolBean = rolBean;
    }
}
