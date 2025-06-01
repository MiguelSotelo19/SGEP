package mx.edu.utez.Eventos.Model.ParticipantesEventos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParticipantesEventosRepository extends JpaRepository<ParticipantesEventosBean,Long> {
}
