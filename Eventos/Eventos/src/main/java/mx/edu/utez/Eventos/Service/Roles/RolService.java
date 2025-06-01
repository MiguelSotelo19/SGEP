package mx.edu.utez.Eventos.Service.Roles;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Roles.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@AllArgsConstructor
public class RolService {

    @Autowired
    private RolRepository repository;

    @Transactional(readOnly = true)
    public ApiResponse findAll() {
        return new ApiResponse(repository.findAll(), HttpStatus.OK.value(), "OK");
    }
}
