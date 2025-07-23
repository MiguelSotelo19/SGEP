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

@Service
public class ParticipantesEventosService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EventosRepository eventosRepository;

    @Autowired
    private ParticipantesEventosRepository participantesEventosRepository;

    // Registrar participante en evento
    public boolean registrarUsuariosEventos(Long idUsuario, Long idEvento) {
        UsuarioBean usuario = usuarioRepository.findById(idUsuario).orElse(null);
        EventosBean evento = eventosRepository.findById(idEvento).orElse(null);

        if (usuario == null || evento == null) {
            return false;
        }

        // Verificamos si ya existe una inscripción previa
        boolean yaInscrito = participantesEventosRepository
                .existsByUsuarioAndEvento(usuario, evento);

        if (yaInscrito) {
            return false; // Evitamos duplicados
        }

        ParticipantesEventosBean participante = new ParticipantesEventosBean(usuario, evento);
        participantesEventosRepository.save(participante);

        return true;
    }

    // Obtener eventos por usuario
    public List<ParticipantesEventosBean> obtenerEventosPorUsuario(Long idUsuario) {
        UsuarioBean usuario = usuarioRepository.findById(idUsuario).orElse(null);
        if (usuario == null) {
            return List.of(); // lista vacía si no existe usuario
        }
        return participantesEventosRepository.findAllByUsuario(usuario);
    }

    public List<ParticipantesEventosBean> obtenerParticipantesPorEvento(Long idEvento){
        EventosBean evento = eventosRepository.findById(idEvento).orElse(null);
        if (evento == null){
            return List.of();
        }
        return  participantesEventosRepository.findByEvento(evento);
    }

    public boolean anularAsistencia(Long idUsuario, Long idEvento){
        UsuarioBean usuario = usuarioRepository.findById(idUsuario).orElse(null);
        EventosBean evento = eventosRepository.findById(idEvento).orElse(null);

        if (usuario == null || evento == null){
            return false;
        }
        ParticipantesEventosBean participante = participantesEventosRepository.findByUsuarioAndEvento(usuario,evento);

        if (participante == null){
            return false;
        }

        participantesEventosRepository.delete(participante);
        return true;
    }
}
