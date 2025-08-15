package mx.edu.utez.Eventos.Controller.ParticipantesEventos;

import jakarta.validation.Valid;
import mx.edu.utez.Eventos.Model.ParticipantesEventos.ParticipantesEventosDTO;
import mx.edu.utez.Eventos.Service.ParticipantesEventosService.ParticipantesEventosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/participantesevento")
public class ParticipantesEventosController {

    @Autowired
    private final ParticipantesEventosService participantesEventosService;

    public ParticipantesEventosController(ParticipantesEventosService participantesEventosService) {
        this.participantesEventosService = participantesEventosService;
    }

    @PostMapping("/")
    public ResponseEntity<String> registrarUsuariosEventos(@Valid @RequestBody ParticipantesEventosDTO dto) {
        try {
            boolean registro = participantesEventosService.registrarUsuariosEventos(dto.getId_usuario(), dto.getId_evento(), dto.getCodigo());

            if (registro) {
                return ResponseEntity.ok("Usuario registrado correctamente en el evento.");
            } else {
                return ResponseEntity.badRequest().body("No se pudo registrar al usuario. Verifica que el evento o usuario existan.");
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor.");
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerEventosPorUsuario(@PathVariable Long idUsuario) {
        try {
            var eventos = participantesEventosService.obtenerEventosPorUsuario(idUsuario);
            if (eventos == null || eventos.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor.");
        }
    }

    @GetMapping("/asistentes/{idEvento}")
    public ResponseEntity<?> obtenerUsuariosPorEvento(@PathVariable Long idEvento) {
        try {
            var usuarios = participantesEventosService.obtenerParticipantesPorEvento(idEvento);
            if (usuarios == null || usuarios.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor");
        }
    }

    @DeleteMapping("/anularasistencia/{idUsuario}/{idEvento}")
    public ResponseEntity<String> anularAsistencia(@PathVariable Long idUsuario, @PathVariable Long idEvento) {
        try {
            boolean deleted = participantesEventosService.anularAsistencia(idUsuario, idEvento);
            if (deleted) {
                return ResponseEntity.ok("Asistencia anulada correctamente");
            } else {
                return ResponseEntity.badRequest().body("No se encontró la asistencia del usuario en el evento");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor");
        }
    }
}
