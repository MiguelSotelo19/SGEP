package mx.edu.utez.Eventos.Model.Usuarios;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import mx.edu.utez.Eventos.Model.Roles.RolBean;

@Entity
@Table(name = "usuarios")
@Data
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol")
    private RolBean rolBean;


}
