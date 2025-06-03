package mx.edu.utez.Eventos.Controller.Usuarios;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.PasswordReset.DTO.CodeDTO;
import mx.edu.utez.Eventos.Model.PasswordReset.DTO.PasswordResetDTO;
import mx.edu.utez.Eventos.Model.Usuarios.DTO.CorreoDTO;
import mx.edu.utez.Eventos.Model.Usuarios.DTO.PasswordDTO;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioDTO;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import mx.edu.utez.Eventos.Service.Usuarios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("api/usuarios")
@AllArgsConstructor
public class UsuariosController {

    @Autowired
    private UsuarioService service;

    @Autowired
    private UsuarioRepository repository;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getAllUsuarios() {
        return new ResponseEntity<>(new ApiResponse(service.getAllUsuarios(), HttpStatus.OK.value(), "OK"), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse> nuevoUsuario(@RequestBody UsuarioDTO dto) {
        return service.newUsuario(dto.toEntity());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        return service.updateUsuario(dto.toEntity(), id);
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verificarEmail(@RequestBody CorreoDTO dto) throws Exception {
        return service.VerifyEmail(dto.getCorreo());
    }

    @PostMapping("/verify/code")
    public ResponseEntity<ApiResponse> verificarCodigo(@RequestBody CodeDTO dto) {
        return service.verifyCode(dto.getCorreo(), dto.getCodigo());
    }

    @PutMapping("/verify/reset")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody PasswordResetDTO dto) {
        return service.newPassword(dto.getCorreo(), dto.getCodigo(), dto.getPassword());
    }


}
