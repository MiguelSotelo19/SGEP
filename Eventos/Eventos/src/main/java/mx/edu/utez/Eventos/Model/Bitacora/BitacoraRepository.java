package mx.edu.utez.Eventos.Model.Bitacora;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BitacoraRepository extends JpaRepository<BitacoraBean,Long> {
    @Query("SELECT b FROM BitacoraBean b ORDER BY b.fecha ASC")
    List<BitacoraBean> findAllOrderedByFechaDesc();
}
