package mx.edu.utez.Eventos.Controller.Roles;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Roles.RolRepository;
import mx.edu.utez.Eventos.Service.Roles.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("api/rol")
@AllArgsConstructor
public class RolController {

    @Autowired
    private RolService service;

    @Autowired
    private RolRepository repository;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> All() {
        return new ResponseEntity<>(new ApiResponse(service.findAll(), HttpStatus.OK.value(), "OK"), HttpStatus.OK);
    }
}
