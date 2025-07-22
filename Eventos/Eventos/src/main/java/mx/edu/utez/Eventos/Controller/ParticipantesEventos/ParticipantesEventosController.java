package mx.edu.utez.Eventos.Controller.ParticipantesEventos;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import mx.edu.utez.Eventos.Model.ParticipantesEventos.ParticipantesEventosDTO;
import mx.edu.utez.Eventos.Service.ParticipantesEventosService.ParticipantesEventosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;


@RestController
@CrossOrigin(origins = {"*"})
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
            boolean registro = participantesEventosService.registrarUsuariosEventos(dto.getId_usuario(), dto.getId_evento());

            if (registro) {
                return ResponseEntity.ok("Usuario registrado correctamente en el evento.");
            } else {
                return ResponseEntity.badRequest().body("No se pudo registrar al usuario. Verifica que el evento o usuario existan.");
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Datos inválidos: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error interno del servidor.");
        }
    }
}
