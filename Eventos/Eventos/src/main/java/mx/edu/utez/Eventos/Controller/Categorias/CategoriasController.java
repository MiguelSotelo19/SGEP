package mx.edu.utez.Eventos.Controller.Categorias;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("api/eventos/categoria")
@AllArgsConstructor
public class CategoriasController {
}
