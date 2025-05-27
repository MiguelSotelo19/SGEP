package mx.edu.utez.Eventos.Model.Participantes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParticipantesRepository extends JpaRepository<ParticipantesBean, Long> {
    Optional<ParticipantesBean> findById(Long id);
}
