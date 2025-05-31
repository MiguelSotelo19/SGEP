package mx.edu.utez.Eventos.Service.Usuarios;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Transactional(readOnly = true)
    public ApiResponse getAllUsuarios() {
        return new ApiResponse(repository.findAll(), HttpStatus.OK.value(), "OK");
    }

    @Transactional
    public ResponseEntity<ApiResponse> newUsuario(UsuarioBean usuario) {
        Optional<UsuarioBean> findCorreo = repository.findByCorreo(usuario.getCorreo());
        Optional<UsuarioBean> findTel = repository.findByTelefono(usuario.getTelefono());

        if(findCorreo.isPresent() || findTel.isPresent()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST.value(), findTel.isPresent() ? "El número de telefono ya se encuentra registrado": "El correo ya se encuentra registrado", true), HttpStatus.BAD_REQUEST);
        }

        String encrypted = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(encrypted);

        UsuarioBean saved = repository.saveAndFlush(usuario);

        return new ResponseEntity<>(new ApiResponse(saved, HttpStatus.OK.value(), "Usuario registrado!"), HttpStatus.OK);
    }

    @Transactional
    public ResponseEntity<ApiResponse> updateUsuario(UsuarioBean usuario, Long id) {
        Optional<UsuarioBean> find = repository.findById(id);

        if (find.isPresent()) {
            UsuarioBean existingUser = find.get();

            Optional<UsuarioBean> userWithSameEmail = repository.findByCorreo(usuario.getCorreo());
            boolean correoEnUso = userWithSameEmail.isPresent() &&
                    !userWithSameEmail.get().getId_usuario().equals(existingUser.getId_usuario());

            Optional<UsuarioBean> userWithSamePhone = repository.findByTelefono(usuario.getTelefono());
            boolean telefonoEnUso = userWithSamePhone.isPresent() &&
                    !userWithSamePhone.get().getId_usuario().equals(existingUser.getId_usuario());

            if (correoEnUso || telefonoEnUso) {
                return new ResponseEntity<>(
                        new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Correo o teléfono ya se encuentra en uso por otro usuario", true),
                        HttpStatus.BAD_REQUEST
                );
            }

            existingUser.setNombre(usuario.getNombre());
            existingUser.setCorreo(usuario.getCorreo());
            existingUser.setTelefono(usuario.getTelefono());
            existingUser.setApellido_materno(usuario.getApellido_materno());
            existingUser.setApellido_paterno(usuario.getApellido_paterno());

            repository.save(existingUser);

            return new ResponseEntity<>(new ApiResponse(existingUser, HttpStatus.OK.value(), "Usuario actualizado correctamente"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.NOT_FOUND.value(), "Usuario no encontrado", true),
                    HttpStatus.NOT_FOUND
            );
        }
    }

    public ResponseEntity<ApiResponse> cambiarEstado(Long id) {
        Optional<UsuarioBean> find = repository.findById(id);

        if (find.isPresent()) {
            UsuarioBean usuario = find.get();

            if(usuario.getEstatus()){
                usuario.setEstatus(false);
            } else {
                usuario.setEstatus(true);
            }
            repository.save(usuario);
            return new ResponseEntity<>(new ApiResponse(usuario, HttpStatus.OK.value(), "Usuario actualizado correctamente"), HttpStatus.OK);
        }

        return new ResponseEntity<>(
                new ApiResponse(HttpStatus.NOT_FOUND.value(), "No encontrado!", true),
                HttpStatus.NOT_FOUND
        );
    }

}

