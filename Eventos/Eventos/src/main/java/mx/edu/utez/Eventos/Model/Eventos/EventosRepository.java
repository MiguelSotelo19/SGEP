package mx.edu.utez.Eventos.Model.Eventos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventosRepository extends JpaRepository<EventosBean, Long> {
    Optional<EventosBean> findById(Long id);
}
