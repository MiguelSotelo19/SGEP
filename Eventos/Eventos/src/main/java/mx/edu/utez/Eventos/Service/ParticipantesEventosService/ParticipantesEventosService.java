package mx.edu.utez.Eventos.Service.ParticipantesEventosService;

import mx.edu.utez.Eventos.Model.Eventos.EventosBean;
import mx.edu.utez.Eventos.Model.Eventos.EventosRepository;
import mx.edu.utez.Eventos.Model.ParticipantesEventos.ParticipantesEventosBean;
import mx.edu.utez.Eventos.Model.ParticipantesEventos.ParticipantesEventosRepository;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipantesEventosService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EventosRepository eventosRepository;

    @Autowired
    private ParticipantesEventosRepository participantesEventosRepository;

    // Registrar participante en evento con validación
    public boolean registrarUsuariosEventos(Long idUsuario, Long idEvento, String codigo) {
        Optional<UsuarioBean> usuarioOpt = usuarioRepository.findById(idUsuario);
        Optional<EventosBean> eventoOpt = eventosRepository.findById(idEvento);

        if (usuarioOpt.isEmpty() || eventoOpt.isEmpty()) {
            return false;
        }

        UsuarioBean usuario = usuarioOpt.get();
        EventosBean evento = eventoOpt.get();

        // Validar código si el evento es privado
        if ("Privado".equalsIgnoreCase(evento.getTipo_evento())) {
            if (codigo == null || codigo.isEmpty()) {
                throw new IllegalArgumentException("Este evento es privado, se requiere un código de acceso.");
            }
            if (!codigo.equals(evento.getCodigo())) {
                throw new IllegalArgumentException("Código de acceso incorrecto.");
            }
        }

        // Validar si usuario ya está inscrito
        boolean yaInscrito = participantesEventosRepository.existsByUsuarioAndEvento(usuario, evento);
        if (yaInscrito) {
            throw new IllegalArgumentException("El usuario ya está inscrito en este evento.");
        }

        // Contar inscritos actuales
        int inscritos = participantesEventosRepository.countByEvento(evento);
        if (inscritos >= evento.getLimite_usuarios()) {
            throw new IllegalArgumentException("El evento ha alcanzado el límite de usuarios.");
        }

        // Guardar inscripción
        ParticipantesEventosBean participante = new ParticipantesEventosBean(usuario, evento);
        participantesEventosRepository.save(participante);

        return true;
    }

    // Obtener eventos por usuario
    public List<ParticipantesEventosBean> obtenerEventosPorUsuario(Long idUsuario) {
        Optional<UsuarioBean> usuarioOpt = usuarioRepository.findById(idUsuario);
        if (usuarioOpt.isEmpty()) {
            return List.of();
        }
        return participantesEventosRepository.findAllByUsuario(usuarioOpt.get());
    }

    // Obtener participantes por evento
    public List<ParticipantesEventosBean> obtenerParticipantesPorEvento(Long idEvento) {
        Optional<EventosBean> eventoOpt = eventosRepository.findById(idEvento);
        if (eventoOpt.isEmpty()) {
            return List.of();
        }
        return participantesEventosRepository.findByEvento(eventoOpt.get());
    }

    // Anular asistencia
    public boolean anularAsistencia(Long idUsuario, Long idEvento) {
        Optional<UsuarioBean> usuarioOpt = usuarioRepository.findById(idUsuario);
        Optional<EventosBean> eventoOpt = eventosRepository.findById(idEvento);

        if (usuarioOpt.isEmpty() || eventoOpt.isEmpty()) {
            return false;
        }

        ParticipantesEventosBean participante = participantesEventosRepository.findByUsuarioAndEvento(usuarioOpt.get(), eventoOpt.get());
        if (participante == null) {
            return false;
        }

        participantesEventosRepository.delete(participante);
        return true;
    }
}
