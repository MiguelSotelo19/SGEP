package mx.edu.utez.Eventos.Controller.Usuarios;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.PasswordReset.DTO.CodeDTO;
import mx.edu.utez.Eventos.Model.PasswordReset.DTO.PasswordResetDTO;
import mx.edu.utez.Eventos.Model.Usuarios.DTO.CorreoDTO;
import mx.edu.utez.Eventos.Model.Usuarios.DTO.IntentosDTO;
import mx.edu.utez.Eventos.Model.Usuarios.DTO.PasswordDTO;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioDTO;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import mx.edu.utez.Eventos.Service.Usuarios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("api/usuarios")
@AllArgsConstructor
public class UsuariosController {

    @Autowired
    private UsuarioService service;

    @Autowired
    private UsuarioRepository repository;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        return new ResponseEntity<>(
                new ApiResponse(null, 400, "Errores de validación: " + String.join("; ", errors)),
                HttpStatus.BAD_REQUEST
        );
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllUsuarios(Authentication authentication) {
        return new ResponseEntity<>(new ApiResponse(service.getAllUsuarios(authentication), HttpStatus.OK.value(), "OK"), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUsuario(
            @PathVariable Long id
    ) {
        return new ResponseEntity<>(new ApiResponse(service.getOneUser(id), HttpStatus.OK.value(), "OK"), HttpStatus.OK);
    }

    @PostMapping("/registro")
    public ResponseEntity<ApiResponse> nuevoUsuario(@Validated(UsuarioDTO.Register.class) @RequestBody UsuarioDTO dto, Authentication authentication) {
        return service.newUsuario(dto.toEntity(), authentication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizarUsuario(
            @PathVariable Long id,
            @Validated(UsuarioDTO.Modify.class) @RequestBody UsuarioDTO dto,
            Authentication authentication
    ) {
        return service.updateUsuario(dto.toEntity(), id, authentication);
    }

    @GetMapping("/consultar-bloqueo/{correo:.+}")
    public ResponseEntity<ApiResponse> consultarBloqueo(@PathVariable String correo, Authentication authentication) {
        return new ResponseEntity<>(service.consultarUsuario(correo, authentication), HttpStatus.OK);
    }


    @PostMapping("/bloquear/{correo:.+}")
    public ResponseEntity<ApiResponse> bloquearUsuario(@PathVariable String correo, Authentication authentication) {
        return service.bloquearUsuario(correo, authentication);
    }


    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verificarEmail(@RequestBody CorreoDTO dto, Authentication authentication) throws Exception {
        return service.VerifyEmail(dto.getCorreo(), authentication);
    }

    @PostMapping("/verify/code")
    public ResponseEntity<ApiResponse> verificarCodigo(@RequestBody CodeDTO dto, Authentication authentication) {
        return service.verifyCode(dto.getCorreo(), dto.getCodigo(), authentication);
    }

    @PutMapping("/verify/reset")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody PasswordResetDTO dto, Authentication authentication) {
        return service.newPassword(dto.getCorreo(), dto.getCodigo(), dto.getPassword(), authentication);
    }

}
