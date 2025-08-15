package mx.edu.utez.Eventos.Model.ParticipantesEventos;

import mx.edu.utez.Eventos.Model.Eventos.EventosBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ParticipantesEventosRepository extends JpaRepository<ParticipantesEventosBean, Long> {
    List<ParticipantesEventosBean> findAllByUsuario(UsuarioBean usuario);

    boolean existsByUsuarioAndEvento(UsuarioBean usuario, EventosBean evento);

    List<ParticipantesEventosBean> findByEvento(EventosBean evento);

    ParticipantesEventosBean findByUsuarioAndEvento(UsuarioBean usuario, EventosBean evento);

    int countByEvento(EventosBean evento);

    @Modifying
    @Transactional
    @Query("DELETE FROM ParticipantesEventosBean p WHERE p.evento.id_evento = :eventoId")
    void deleteByEventoId(@Param("eventoId") Long eventoId);
}
