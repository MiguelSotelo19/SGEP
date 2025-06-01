package mx.edu.utez.Eventos.Model.Eventos;

import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;

public class EventoPrivadoFactory implements EventoFactory {
    private final CategoriaRepository categoriaRepository;

    public EventoPrivadoFactory(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public EventosBean crearEvento(EventoDTO dto) {
        EventosBean evento = new EventosBean();
        evento.setNombre_evento(dto.getNombre_evento());
        evento.setFecha(dto.getFecha());
        evento.setLugar(dto.getLugar());
        CategoriaBean categoria = categoriaRepository.findById(dto.getId_categoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        evento.setCategoriaBean(categoria);
        evento.setEstatus(true);
        evento.setTipo_evento("Privado");
        return evento;
    }
}
