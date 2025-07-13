package mx.edu.utez.Eventos.Service.Usuarios;

import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.PasswordReset.PasswordReset;
import mx.edu.utez.Eventos.Model.PasswordReset.PasswordResetRepository;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import javax.swing.text.html.Option;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static java.lang.Integer.parseInt;
import org.slf4j.Logger;

@Service
@Transactional
public class UsuarioService {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String codigo = "";

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordResetRepository resetRepository;


    @Transactional
    public ApiResponse consultarUsuario(String correo) {
        Optional<UsuarioBean> optionalUsuario = repository.findByCorreo(correo);

        System.out.println(optionalUsuario.get().getLimitefecha());

        if (optionalUsuario.isPresent()) {
            LocalDateTime limite = optionalUsuario.get().getLimitefecha();
            logger.info("Consultando al usuario con correo: " +correo);
            return new ApiResponse(limite, HttpStatus.OK.value(), "Ok");
        } else {
            return new ApiResponse(null, HttpStatus.NOT_FOUND.value(), "Usuario no encontrado");
        }
    }


    @Transactional(readOnly = true)
    public ApiResponse getAllUsuarios() {
        logger.info("Se han consultado a todos los usuarios");
        return new ApiResponse(repository.findAll(), HttpStatus.OK.value(), "OK");
    }

    @Transactional
    public ResponseEntity<ApiResponse> newUsuario(UsuarioBean usuario) {
        Optional<UsuarioBean> findCorreo = repository.findByCorreo(usuario.getCorreo());
        Optional<UsuarioBean> findTel = repository.findByTelefono(usuario.getTelefono());

        if(findCorreo.isPresent() || findTel.isPresent()) {
            logger.warn("El intento de registro falló debido a " + (findTel.isPresent() ? "número de teléfono duplicado" : "correo electrónico duplicado"));
            return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST.value(), findTel.isPresent() ? "El número de telefono ya se encuentra registrado": "El correo ya se encuentra registrado", true), HttpStatus.BAD_REQUEST);
        }

        String encrypted = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(encrypted);

        UsuarioBean saved = repository.saveAndFlush(usuario);
        logger.info("Se ha registrado a un nuevo usuario con correo: " + saved.getCorreo());
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
                logger.warn("El intento de registro falló debido a " + (telefonoEnUso ? "número de teléfono duplicado" : "correo electrónico duplicado"));
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
            logger.info("Se ha actualizado correctamente al uusario con correo: " +existingUser.getCorreo());
            return new ResponseEntity<>(new ApiResponse(existingUser, HttpStatus.OK.value(), "Usuario actualizado correctamente"), HttpStatus.OK);
        } else {
            logger.warn("El usuario con ID : " + id  + " no ha sido localizado");
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
            logger.info("El estatus del usuario con correo:" + usuario.getCorreo() + " ha sido cambiado por: " + (usuario.getEstatus() ? "Activo" : "Inactivo") );
            return new ResponseEntity<>(new ApiResponse(usuario, HttpStatus.OK.value(), "Usuario actualizado correctamente"), HttpStatus.OK);
        }
        logger.warn("El usuario con ID " +id + "no ha sido localizado");
        return new ResponseEntity<>(
                new ApiResponse(HttpStatus.NOT_FOUND.value(), "No encontrado!", true),
                HttpStatus.NOT_FOUND
        );
    }

    @Transactional
    public ResponseEntity<ApiResponse> bloquearUsuario(String correo) {
        Optional<UsuarioBean> find = repository.findByCorreo(correo);

        if (find.isPresent()) {
            UsuarioBean usuario = find.get();
            usuario.setLimitefecha(LocalDateTime.now().plusMinutes(30));
            repository.save(usuario);
            logger.info("Se ha bloqueado por " +usuario.getLimitefecha() +  " minutos al usuario con correo: " + usuario.getCorreo());
            return new ResponseEntity<>(new ApiResponse(usuario, HttpStatus.OK.value(), "Usuario actualizado correctamente"), HttpStatus.OK);
        } else {
            logger.info("El usuario con correo: " +correo + "no ha sido localizado");
            return new ResponseEntity<>(new ApiResponse(HttpStatus.NOT_FOUND.value(), "Usuario no encontrado", false), HttpStatus.NOT_FOUND);
        }
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
            logger.info("Se ha enviado un correo electrónico al usuario con correo: " +token.getEmail());
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK.value(), "Código enviado", false), HttpStatus.OK);
        }
        logger.warn("El usuario con correo " +email + "no ha sido localizado");
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
                logger.info("Se ha actualizado la contraseña del usuario con correo: " +user.getCorreo());
                return new ResponseEntity<>(new ApiResponse(HttpStatus.OK.value(), "Contraseña reestablecida", false), HttpStatus.OK);
            }
        }
        logger.warn("El código ingresado se encuentra expirado o es inválido");
        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Código inválido o expirado", true), HttpStatus.BAD_REQUEST);
    }


    public ResponseEntity<ApiResponse> verifyCode(String email, String code) {
        Optional<PasswordReset> tokenOpt = resetRepository.findByEmailAndCodeAndUsedFalse(email, code.trim());
        if (tokenOpt.isPresent() && tokenOpt.get().getExpiration().isAfter(LocalDateTime.now())) {
            logger.info("El código usado por el usuario con correo: " +email + " es válido");
            return new ResponseEntity<>(new ApiResponse(HttpStatus.OK.value(), "Código válido", false), HttpStatus.OK);
        }
        logger.warn("El código ingresado se encuentra expirado o es inválido");
        return new ResponseEntity<>(new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Código no válido o expirado", true), HttpStatus.BAD_REQUEST);
    }
    public String GenerarCodigo() {
        codigo = ""; // reiniciar
        for (int i = 0; i < 6; i++) {
            int digito = (int) (Math.random() * 10);
            codigo += digito;
        }
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
                        + "<h1 style='text-align: center; font-weight: bold;'>¡Hola!</h1>"
                        + "<p style='font-weight: bold; text-align: center;'>¡Esperamos que estés bien!</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Este es un correo de parte de SGEP para darte tu código de verificación 🔥🫦🔥.</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Tu código es:</p>"
                        + "<div style='background-color: #f8f9fa; padding: 18px; border-radius: 10px; "
                        + "box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: inline-block; "
                        + "font-size: 32px; font-weight: bold; letter-spacing: 10px; text-align: center; "
                        + "margin: 20px auto; width: 100%;'>"
                        + codigo
                        + "</div>"
                        + "<p style='font-size: 18px; text-align: center;'>¡Tienes 5 minutos a partir de ahora para utilizarlo!</p>"
                        + "<p style='font-size: 18px; text-align: center;'>Gracias.</p>"
                        + "</div>";



        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

}


