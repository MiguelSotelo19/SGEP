package mx.edu.utez.Eventos.Model.Roles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<RolBean, Long> {
    Optional<RolBean> findById(Long id);
}
