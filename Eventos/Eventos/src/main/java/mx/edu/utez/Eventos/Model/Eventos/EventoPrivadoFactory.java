package mx.edu.utez.Eventos.Model.Eventos;

import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;

import java.util.Random;

public class EventoPrivadoFactory implements EventoFactory {
    private final CategoriaRepository categoriaRepository;
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 5;
    private static final Random random = new Random();

    public EventoPrivadoFactory(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public EventosBean crearEvento(EventoDTO dto) {
        EventosBean evento = new EventosBean();
        evento.setNombre_evento(dto.getNombre_evento());
        evento.setFecha(dto.getFecha());
        evento.setLugar(dto.getLugar());
        evento.setLimite_usuarios(100L);
        CategoriaBean categoria = categoriaRepository.findById(dto.getId_categoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        evento.setCategoriaBean(categoria);
        evento.setEstatus(true);
        evento.setTipo_evento("Privado");
        evento.setCodigo(generateUniqueCode());
        return evento;
    }

    private String generateUniqueCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}
