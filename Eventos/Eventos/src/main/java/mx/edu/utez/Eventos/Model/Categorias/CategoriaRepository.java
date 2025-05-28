package mx.edu.utez.Eventos.Model.Categorias;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaBean, Long> {
    Optional<CategoriaBean>findByEstatusTrue();
    Optional<CategoriaBean>findByNombre(String nombre);
}
