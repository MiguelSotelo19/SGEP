package mx.edu.utez.Eventos.Model.ParticipantesEventos;

import mx.edu.utez.Eventos.Model.Eventos.EventosBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantesEventosRepository extends JpaRepository<ParticipantesEventosBean,Long> {
    List<ParticipantesEventosBean> findAllByUsuario(UsuarioBean usuario);

    boolean existsByUsuarioAndEvento(UsuarioBean usuario, EventosBean evento);
}
