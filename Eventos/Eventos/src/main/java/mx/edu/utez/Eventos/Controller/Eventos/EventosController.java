package mx.edu.utez.Eventos.Controller.Eventos;

import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;
import mx.edu.utez.Eventos.Model.Eventos.EventoDTO;
import mx.edu.utez.Eventos.Model.Eventos.EventoResponseDTO;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;
import mx.edu.utez.Eventos.Model.Eventos.EventosRepository;
import mx.edu.utez.Eventos.Service.Eventos.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("api/talleres")
public class EventosController {

    @Autowired
    private EventoService eventoService;

    @Autowired
    private EventosRepository eventosRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

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
    public ResponseEntity<List<EventoResponseDTO>> getEventos() {
        List<EventosBean> eventos = eventosRepository.findAll();

        List<EventoResponseDTO> response = eventos.stream()
                .map(EventoResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/one/{id}")
    public ResponseEntity<ApiResponse> getEventoById(@PathVariable Long id) {
        EventosBean evento = eventosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taller no encontrado con Id: "+id));
        
        return ResponseEntity.ok(new ApiResponse(evento, HttpStatus.OK.value(), "Taller encontrado"));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> crearEvento(@Validated(EventoDTO.Register.class) @RequestBody EventoDTO dto) {
        EventosBean evento = eventoService.crearEventoPorTipo(dto);
        eventosRepository.save(evento);

        return ResponseEntity.ok(new ApiResponse(evento, HttpStatus.CREATED.value(), "Taller creado con éxito"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> actualizarEvento( @Validated(EventoDTO.Modify.class) @PathVariable Long id, @RequestBody EventoDTO dto) {
        EventosBean evento = eventosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taller no encontrado con Id: "+id));

        evento.setNombre_evento(dto.getNombre_evento());
        evento.setFecha(dto.getFecha());
        evento.setLugar(dto.getLugar());

        CategoriaBean categoria = categoriaRepository.findById(dto.getId_categoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        evento.setCategoriaBean(categoria);

        eventosRepository.save(evento);

        return ResponseEntity.ok(new ApiResponse(evento, HttpStatus.OK.value(), "Taller actualizado"));
    }

    @PutMapping("/cambiarEstado/{id}")
    public ResponseEntity<ApiResponse> cambiarEstado(@Validated(EventoDTO.ChangeStatus.class) @PathVariable Long id, @RequestBody boolean estado) {
        EventosBean evento = eventosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taller no encontrado con Id: "+id));

        evento.setEstatus(estado);
        eventosRepository.save(evento);

        return ResponseEntity.ok(new ApiResponse(evento, HttpStatus.OK.value(), "Estado de taller actualizado"));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> eliminarEvento(@PathVariable Long id) {
        EventosBean evento = eventosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taller no encontrado"));

        eventosRepository.delete(evento);

        return ResponseEntity.ok(new ApiResponse(null, HttpStatus.OK.value(), "Taller eliminado con éxito"));
    }
}
