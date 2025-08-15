package mx.edu.utez.Eventos.Controller.Eventos;

import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Bitacora.BitacoraBean;
import mx.edu.utez.Eventos.Model.Bitacora.BitacoraRepository;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;
import mx.edu.utez.Eventos.Model.Eventos.EventoDTO;
import mx.edu.utez.Eventos.Model.Eventos.EventoResponseDTO;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;
import mx.edu.utez.Eventos.Model.Eventos.EventosRepository;
import mx.edu.utez.Eventos.Model.ParticipantesEventos.ParticipantesEventosRepository;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import mx.edu.utez.Eventos.Service.Eventos.EventoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BitacoraRepository bitacoraRepository;

    @Autowired
    private ParticipantesEventosRepository participantesEventosRepository;

    private static final Logger logger = LoggerFactory.getLogger(EventosController.class);


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

    //COLOCAR ESTO PARA LA BITACORA PQ BUSCA A LA PERSONA EN SESIÓN
    private UsuarioBean getUsuarioAutenticado(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return null;
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return usuarioRepository.findByCorreo(username).orElse(null);
    }
    @GetMapping("/")
    public ResponseEntity<List<EventoResponseDTO>> getEventos(Authentication authentication) {
        List<EventosBean> eventos = eventosRepository.findAll();

        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "GET",
                usuarioAutenticado,
                "Se ha consultado la información de todos los eventos "
        );

        List<EventoResponseDTO> response = eventos.stream()
                .map(EventoResponseDTO::new)
                .collect(Collectors.toList());

        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/one/{id}")
    public ResponseEntity<ApiResponse> getEventoById(@PathVariable Long id, Authentication authentication) {
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        EventosBean evento = eventosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taller no encontrado con Id: "+id));

        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "GET",
                usuarioAutenticado,
                "Se ha consultado la información del evento con ID:  " +id
        );

        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");

        return ResponseEntity.ok(new ApiResponse(evento, HttpStatus.OK.value(), "Taller encontrado"));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> crearEvento(@Validated(EventoDTO.Register.class) @RequestBody EventoDTO dto ,Authentication authentication) {

        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        EventosBean evento = eventoService.crearEventoPorTipo(dto);
        eventosRepository.save(evento);

        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "POST",
                usuarioAutenticado,
                "Se ha creado un nuevo evento: " + evento.getNombre_evento()
        );
        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");

        return ResponseEntity.ok(new ApiResponse(evento, HttpStatus.CREATED.value(), "Taller creado con éxito"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> actualizarEvento( @Validated(EventoDTO.Modify.class) @PathVariable Long id, @RequestBody EventoDTO dto, Authentication authentication) {
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        EventosBean evento = eventosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taller no encontrado con Id: "+id));

        evento.setNombre_evento(dto.getNombre_evento());
        evento.setFecha(dto.getFecha());
        evento.setLugar(dto.getLugar());

        CategoriaBean categoria = categoriaRepository.findById(dto.getId_categoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        evento.setCategoriaBean(categoria);

        eventosRepository.save(evento);

        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "PUT",
                usuarioAutenticado,
                "Se ha actualizado la información del evento con ID" +id
        );

        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");
        return ResponseEntity.ok(new ApiResponse(evento, HttpStatus.OK.value(), "Taller actualizado"));
    }

    @PutMapping("/cambiarEstado/{id}")
    public ResponseEntity<ApiResponse> cambiarEstado(@Validated(EventoDTO.ChangeStatus.class) @PathVariable Long id, @RequestBody boolean estado, Authentication authentication) {
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        EventosBean evento = eventosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taller no encontrado con Id: "+id));

        evento.setEstatus(estado);
        eventosRepository.save(evento);

        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "PUT",
                usuarioAutenticado,
                "Se ha cambiado el estado del evento con ID " + id + " Por " + estado
        );

        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");

        return ResponseEntity.ok(new ApiResponse(evento, HttpStatus.OK.value(), "Estado de taller actualizado"));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> eliminarEvento(@PathVariable Long id, Authentication authentication) {
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        EventosBean evento = eventosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taller no encontrado"));

        // 1. Primero eliminar los participantes asociados
        participantesEventosRepository.deleteByEventoId(id);

        eventosRepository.delete(evento);

        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "DELETE",
                usuarioAutenticado,
                "Se ha eliminado el evento con ID " +id
        );

        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");

        return ResponseEntity.ok(new ApiResponse(null, HttpStatus.OK.value(), "Taller eliminado con éxito"));
    }
}
