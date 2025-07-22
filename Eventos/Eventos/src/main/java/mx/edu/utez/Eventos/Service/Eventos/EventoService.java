package mx.edu.utez.Eventos.Service.Eventos;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;
import mx.edu.utez.Eventos.Model.Eventos.*;
import mx.edu.utez.Eventos.Service.Usuarios.UsuarioService;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;

@Service
public class EventoService {
    private static final Logger logger = LoggerFactory.getLogger(EventoService.class);

    private final CategoriaRepository categoriaRepository;

    public EventoService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public EventosBean crearEventoPorTipo(EventoDTO dto) {
        EventoFactory factory;

        switch (dto.getTipo_evento().toLowerCase()) {
            case "publico":
                factory = new EventoPublicoFactory(categoriaRepository);
                break;
            case "privado":
                factory = new EventoPrivadoFactory(categoriaRepository);
                break;
            default:
                throw new IllegalArgumentException("Tipo de taller no valido");
        }

        return factory.crearEvento(dto);
    }
}
