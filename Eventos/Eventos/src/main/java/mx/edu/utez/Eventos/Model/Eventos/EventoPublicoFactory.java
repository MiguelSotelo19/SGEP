package mx.edu.utez.Eventos.Model.Eventos;

import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;

public class EventoPublicoFactory implements EventoFactory {
    private final CategoriaRepository categoriaRepository;

    public EventoPublicoFactory(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public EventosBean crearEvento(EventoDTO dto) {
        EventosBean evento = new EventosBean();
        evento.setNombre_evento(dto.getNombre_evento());
        evento.setFecha(dto.getFecha());
        evento.setLugar(dto.getLugar());
        evento.setLimite_usuarios(dto.getLimite_usuarios());
        CategoriaBean categoria = categoriaRepository.findById(dto.getId_categoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        evento.setCategoriaBean(categoria);

        evento.setEstatus(true);
        evento.setTipo_evento("Publico");
        return evento;
    }
}
