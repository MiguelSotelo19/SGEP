package mx.edu.utez.Eventos.Model.ParticipantesEventos;

import jakarta.persistence.*;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;

@Entity
@Table(name = "participantes_eventos")
public class ParticipantesEventosBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_participantesEventos;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private UsuarioBean usuario;

    @ManyToOne
    @JoinColumn(name = "id_evento", nullable = false)
    private EventosBean evento;

    public ParticipantesEventosBean() {}

    public ParticipantesEventosBean(UsuarioBean usuario, EventosBean evento) {
        this.usuario = usuario;
        this.evento = evento;
    }

    // Getters y setters
    public Long getId_participantesEventos() {
        return id_participantesEventos;
    }

    public void setId_participantesEventos(Long id_participantesEventos) {
        this.id_participantesEventos = id_participantesEventos;
    }

    public UsuarioBean getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioBean usuario) {
        this.usuario = usuario;
    }

    public EventosBean getEvento() {
        return evento;
    }

    public void setEvento(EventosBean evento) {
        this.evento = evento;
    }
}
