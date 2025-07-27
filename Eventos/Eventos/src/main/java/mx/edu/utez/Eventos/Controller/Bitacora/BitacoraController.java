package mx.edu.utez.Eventos.Controller.Bitacora;

import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Service.Bitacora.BitacoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/api/movimientos")
public class BitacoraController {

    @Autowired
    private BitacoraService service;

    @GetMapping("/")
    public ResponseEntity<ApiResponse> getMovimientos(Authentication authentication){
        return service.getBitacora(authentication);
    }
}
