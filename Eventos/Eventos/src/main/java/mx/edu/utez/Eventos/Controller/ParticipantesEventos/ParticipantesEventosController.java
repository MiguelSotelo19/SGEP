package mx.edu.utez.Eventos.Controller.ParticipantesEventos;

import mx.edu.utez.Eventos.Model.Eventos.EventoDTO;
import mx.edu.utez.Eventos.Model.ParticipantesEventos.ParticipantesEventosDTO;
import mx.edu.utez.Eventos.Service.ParticipantesEventosService.ParticipantesEventosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/api/participantesevento")
public class ParticipantesEventosController {

    @Autowired
    private ParticipantesEventosService participantesEventosService;

    @PostMapping("/")
    public ResponseEntity<String> registrarUsuariosEventos(@RequestBody ParticipantesEventosDTO dto) {
        boolean registro = participantesEventosService.registrarUsuariosEventos(
                dto.getIdUsuario(),dto.getIdEvento());

        if (registro) {
            return ResponseEntity.ok("Usuario registrado correctamente en el evento.");
        } else {
            return ResponseEntity.badRequest().body("No se pudo registrar al usuario. Verifica que el evento o usuario existan.");
        }
    }
}
