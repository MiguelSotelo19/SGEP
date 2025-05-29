package mx.edu.utez.Eventos.Controller.Participantes;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Participantes.ParticipantesRepository;
import mx.edu.utez.Eventos.Service.Participantes.ParticipanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("api/participantes")
@AllArgsConstructor
public class ParticipantesController {

    @Autowired
    private ParticipanteService service;

    @Autowired
    private ParticipantesRepository repository;

    /*@GetMapping("/")
    public ResponseEntity<ApiResponse> participantes(){
        return new ResponseEntity<>(new ApiResponse(service.get))
    }*/

}
