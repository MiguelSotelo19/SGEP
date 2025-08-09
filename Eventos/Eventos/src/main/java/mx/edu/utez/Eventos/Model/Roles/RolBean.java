package mx.edu.utez.Eventos.Model.Roles;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;

import java.util.Set;

@Entity
@Table(name = "rol")
public class RolBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_rol;

    @Column
    private String rol;

    @OneToMany(mappedBy = "rolBean", fetch = FetchType.LAZY)
    private Set<UsuarioBean> usuarioBeans;

    public RolBean() {

    }

    public RolBean(Long id_rol, String rol) {
        this.id_rol = id_rol;
        this.rol = rol;
    }

    public RolBean(Long id_rol, String rol, Set<UsuarioBean> usuarioBeans) {
        this.id_rol = id_rol;
        this.rol = rol;
        this.usuarioBeans = usuarioBeans;
    }

    public Long getId_rol() {
        return id_rol;
    }

    public void setId_rol(Long id_rol) {
        this.id_rol = id_rol;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Set<UsuarioBean> getUsuarioBeans() {
        return usuarioBeans;
    }

    public void setUsuarioBeans(Set<UsuarioBean> usuarioBeans) {
        this.usuarioBeans = usuarioBeans;
    }
}
