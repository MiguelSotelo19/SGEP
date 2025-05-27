package mx.edu.utez.Eventos.Controller.Usuarios;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("api/eventos/usuarios")
@AllArgsConstructor
public class UsuariosController {
}
