package mx.edu.utez.Eventos.Service.Roles;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Roles.RolRepository;
import mx.edu.utez.Eventos.Service.Usuarios.UsuarioService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;

@Service
@Transactional
@AllArgsConstructor
public class RolService {
    private static final Logger logger = LoggerFactory.getLogger(RolService.class);

    @Autowired
    private RolRepository repository;

    @Transactional(readOnly = true)
    public ApiResponse findAll() {
        logger.info("Se obtuvieron todos los tipos de roles");
        return new ApiResponse(repository.findAll(), HttpStatus.OK.value(), "OK");
    }
}
