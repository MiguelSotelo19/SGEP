package mx.edu.utez.Eventos.Service.Bitacora;

import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Bitacora.BitacoraBean;
import mx.edu.utez.Eventos.Model.Bitacora.BitacoraRepository;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import mx.edu.utez.Eventos.Service.Usuarios.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class BitacoraService {
    @Autowired
    private BitacoraRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private UsuarioBean getUsuarioAutenticado(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return null;
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();

        return usuarioRepository.findByCorreo(username).orElse(null);
    }

    public ResponseEntity<ApiResponse> getBitacora(Authentication authentication) {
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);
        logger.info("Usuario autenticado en bitácora: " + (usuarioAutenticado != null ? usuarioAutenticado.getNombre() : "null"));

        BitacoraBean bitacora = new BitacoraBean(LocalDateTime.now(), "GET", usuarioAutenticado, "Se accedió a la bítacora");
        repository.save(bitacora);

        List<BitacoraBean> bitacorasOrdenadas = repository.findAllOrderedByFechaDesc();
        return new ResponseEntity<>(new ApiResponse(bitacorasOrdenadas, HttpStatus.OK.value(), "Bitácora obtenida"), HttpStatus.OK);
    }

}
