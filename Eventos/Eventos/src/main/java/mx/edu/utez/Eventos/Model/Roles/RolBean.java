package mx.edu.utez.Eventos.Model.Roles;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import mx.edu.utez.Eventos.Model.Participantes.ParticipantesBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;

import java.util.Set;

@Entity
@Table(name = "rol")
@Getter
@Setter
public class RolBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_rol;

    @Column
    private String rol;


    @OneToMany(mappedBy = "rolBean", fetch = FetchType.LAZY)
    private Set<UsuarioBean> usuarioBeans;

    @OneToMany(mappedBy = "rolBean", fetch = FetchType.LAZY)
    private Set<ParticipantesBean> participantesBeans;

}
