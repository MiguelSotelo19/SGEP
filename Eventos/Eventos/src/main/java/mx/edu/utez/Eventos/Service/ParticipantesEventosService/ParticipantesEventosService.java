package mx.edu.utez.Eventos.Service.ParticipantesEventosService;

import mx.edu.utez.Eventos.Model.Eventos.EventosBean;
import mx.edu.utez.Eventos.Model.Eventos.EventosRepository;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class ParticipantesEventosService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private EventosRepository eventosRepository;
    public boolean registrarUsuariosEventos(Long idUsuario,Long idEvento){
        UsuarioBean usuario =usuarioRepository.findById(idUsuario).orElse(null);
        EventosBean evento = eventosRepository.findById(idEvento).orElse(null);

        if(usuario==null|| evento==null){
            return false;
        }
        evento.getUsuarios().add(usuario);
        eventosRepository.save(evento);
        return true;


    }
}
