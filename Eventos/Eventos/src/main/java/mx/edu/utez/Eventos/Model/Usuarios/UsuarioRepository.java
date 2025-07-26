package mx.edu.utez.Eventos.Model.Usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<UsuarioBean, Long> {
    Optional<UsuarioBean> findByCorreo(String correo);

    Optional<UsuarioBean> findByTelefono(String telefono);

    Optional<UsuarioBean>findByNombre(String nombre);
}
