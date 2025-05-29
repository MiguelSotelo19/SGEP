package mx.edu.utez.Eventos.Service.Participantes;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Participantes.ParticipantesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
public class ParticipanteService {

    @Autowired
    private ParticipantesRepository repository;

    @Transactional(readOnly = true)
    public ApiResponse getAllParticipantes() {
        return new ApiResponse(repository.findAll(), HttpStatus.OK.value(), "OK");
    }

}
