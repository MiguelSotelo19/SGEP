package mx.edu.utez.Eventos.Model.Participantes;

import jakarta.persistence.*;
import lombok.Data;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;
import mx.edu.utez.Eventos.Model.Roles.RolBean;

@Entity
@Table(name = "participantes")
@Data
public class ParticipantesBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_participante;

    @Column(length = 100)
    private String nombre;

    @Column(length = 100)
    private String apellido_paterno;

    @Column(length = 100)
    private String apellido_materno;

    @Column(length = 50)
    private String correo;

    @Column(length = 250)
    private String direccion;

    private Boolean estatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_rol")
    private RolBean rolBean;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evento")
    private EventosBean evento;



}
