package mx.edu.utez.Eventos.Controller.auth;


import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Controller.auth.dto.SignDto;
import mx.edu.utez.Eventos.Service.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"*"})
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse> signIn(@RequestBody SignDto dto) {
        return service.signIn(dto.getCorreo(), dto.getPassword());
    }
}
