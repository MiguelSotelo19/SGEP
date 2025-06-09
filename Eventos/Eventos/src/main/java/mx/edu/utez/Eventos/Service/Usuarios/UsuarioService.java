package mx.edu.utez.Eventos.Service.Usuarios;

import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.PasswordReset.PasswordReset;
import mx.edu.utez.Eventos.Model.PasswordReset.PasswordResetRepository;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static java.lang.Integer.parseInt;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String codigo = "";

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordResetRepository resetRepository;




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

    @Transactional
    public ResponseEntity<ApiResponse> actualizarIntentos(String correo, int intentos) {
        Optional<UsuarioBean> optionalUsuario = repository.findByCorreo(correo);

        if (optionalUsuario.isEmpty()) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND.value(), "Usuario no encontrado", true), HttpStatus.NOT_FOUND);
        }

        UsuarioBean usuario = optionalUsuario.get();

        // Si ya está bloqueado, no permitimos continuar
        if (usuario.getLimitefecha() != null && usuario.getLimitefecha().isAfter(LocalDateTime.now())) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN.value(), "Cuenta bloqueada hasta " + usuario.getLimitefecha(), true), HttpStatus.FORBIDDEN);

        }

        // Si ya tiene 3 o más intentos, se bloquea
        if (intentos >= 3) {
            usuario.setLimitefecha(LocalDateTime.now().plusMinutes(30)); // Bloqueo de 5 min
            usuario.setIntentos(0); // Reiniciar contador
            repository.save(usuario);

            return new ResponseEntity<>(new ApiResponse(HttpStatus.FORBIDDEN.value(), "Cuenta bloqueada por exceder intentos permitidos", false), HttpStatus.FORBIDDEN);

        }

        // Solo actualizar intentos
        usuario.setIntentos(intentos);
        repository.save(usuario);

        return new ResponseEntity<>(new ApiResponse(HttpStatus.OK.value(), "Intentos actualizandoce", true), HttpStatus.OK);
    }


    @Transactional
    public ResponseEntity<ApiResponse> VerifyEmail(String email) throws Exception {
        Optional<UsuarioBean> find = repository.findByCorreo(email);
        if (find.isPresent()) {

            List<PasswordReset> codigosViejos = resetRepository.findAllByEmailAndUsedFalse(email);
            for (PasswordReset viejo : codigosViejos) {
                viejo.setUsed(true);
            }
            resetRepository.saveAll(codigosViejos);

            String codigo = GenerarCodigo();

            PasswordReset token = new PasswordReset();
            token.setEmail(email);
            token.setCode(codigo);
            token.setExpiration(LocalDateTime.now().plusMinutes(5));
            token.setUsed(false);
            resetRepository.save(token);

            enviarCorreo(email, codigo);
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK.value(), "Código enviado", false), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND.value(), "Usuario no encontrado", false), HttpStatus.NOT_FOUND);
    }


    @Transactional
    public ResponseEntity<ApiResponse> newPassword(String email, String code, String password) {
        Optional<PasswordReset> tokenOpt = resetRepository.findByEmailAndCodeAndUsedFalse(email, code.trim());
        if (tokenOpt.isPresent() && tokenOpt.get().getExpiration().isAfter(LocalDateTime.now())) {
            Optional<UsuarioBean> userOpt = repository.findByCorreo(email);
            if (userOpt.isPresent()) {
                UsuarioBean user = userOpt.get();
                user.setPassword(passwordEncoder.encode(password));
                repository.save(user);

                PasswordReset token = tokenOpt.get();
                token.setUsed(true);
                resetRepository.save(token);

                return new ResponseEntity<>(new ApiResponse(HttpStatus.OK.value(), "Contraseña reestablecida", false), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Código inválido o expirado", true), HttpStatus.BAD_REQUEST);
    }


    public ResponseEntity<ApiResponse> verifyCode(String email, String code) {
        Optional<PasswordReset> tokenOpt = resetRepository.findByEmailAndCodeAndUsedFalse(email, code.trim());
        if (tokenOpt.isPresent() && tokenOpt.get().getExpiration().isAfter(LocalDateTime.now())) {
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK.value(), "Código válido", false), HttpStatus.OK);
        }
        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Código no válido o expirado", true), HttpStatus.BAD_REQUEST);
    }
    public String GenerarCodigo() {
        codigo = ""; // reiniciar
        for (int i = 0; i < 6; i++) {
            int digito = (int) (Math.random() * 10);
            codigo += digito;
        }

        System.out.println("el codigo es: " + codigo);
        return codigo;
    }

    public void enviarCorreo(String correo, String codigo)
            throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(correo);
        helper.setFrom("sgep.recuperar.contra@gmail.com");
        helper.setSubject("Código de recuperación de contraseña");

        String htmlContent =
                "<div style='background-color: #ffffff; padding: 40px; max-width: 600px; margin: 0 auto; "
                        + "border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;'>"
                        + "<h1 style='text-align: center; font-weight: bold;'>¡Hola pequeña 🫦!</h1>"
                        + "<p style='font-weight: bold; text-align: center;'>¡Esperamos que estés bien!</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Este es un correo de parte de SGEP para darte tu código de verificación 🔥🫦🔥.</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Tu código es:</p>"
                        + "<div style='background-color: #f8f9fa; padding: 18px; border-radius: 10px; "
                        + "box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: inline-block; "
                        + "font-size: 32px; font-weight: bold; letter-spacing: 10px; text-align: center; "
                        + "margin: 20px auto; width: 100%;'>"
                        + codigo
                        + "</div>"
                        + "<p style='font-size: 18px; text-align: center;'>Pierdelo y vales vrg bb</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Gracias uwu.</p>"
                        + "</div>";



        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

}


