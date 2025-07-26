package mx.edu.utez.Eventos.Service.Categorias;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Bitacora.BitacoraBean;
import mx.edu.utez.Eventos.Model.Bitacora.BitacoraRepository;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;
import mx.edu.utez.Eventos.Model.Categorias.DTO.CategoriaDTO;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioRepository;
import mx.edu.utez.Eventos.Service.Usuarios.UsuarioService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseBody;
import org.slf4j.Logger;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class CategoriaService {
    private static final Logger logger = LoggerFactory.getLogger(CategoriaService.class);

    @Autowired
    private CategoriaRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BitacoraRepository bitacoraRepository;

    //COLOCAR ESTO PARA LA BITACORA PQ BUSCA A LA PERSONA EN SESIÓN
    private UsuarioBean getUsuarioAutenticado(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return null;
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return usuarioRepository.findByCorreo(username).orElse(null);
    }

    //listado de todas las categorias
    @Transactional()
    public ApiResponse getAllCategorias(Authentication authentication) {
        logger.info("Se han obtenido todas las categorías");
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "GET",
                usuarioAutenticado,
                "Se ha consultado la información de todas los categorias "
        );

        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");

        return new ApiResponse(repository.findAll(), HttpStatus.OK.value(), "OK");
    }

    //listado de las categorias activas
    @Transactional()
    public ResponseEntity<ApiResponse>getAllCategoriasTrue(Authentication authentication){
        logger.info("Se han obtenido a las categorias con estatus activo");
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "GET",
                usuarioAutenticado,
                "Se ha consultado la información de todas las categorias con estatus activo "
        );

        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");
        return new ResponseEntity<>(new ApiResponse(repository.findAllByEstatusTrue(), HttpStatus.OK.value(), "Ok"), HttpStatus.OK);
    }

    //registro de nueva categoria (obviamente sin eventos)
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> newCategoria(CategoriaBean categoria, Authentication authentication) {
        Optional<CategoriaBean> find = repository.findByNombre(categoria.getNombre());
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        if (find.isPresent()) {
            logger.info("La categoria : " +categoria.getNombre() +" Ya se encuentra registrada");
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Ya está registrado", true),
                    HttpStatus.BAD_REQUEST
            );
        }


        // Guardar directamente la categoría recibida
        categoria.setEstatus(true);
        CategoriaBean saved = repository.saveAndFlush(categoria);
        logger.info("Registrando la nueva categoria de nombre: " +saved.getNombre());
        //PASO 2
        BitacoraBean bitacora = new BitacoraBean(
                LocalDateTime.now(),
                "POST",
                usuarioAutenticado,
                "Se ha registrado una nueva categoría con nombre :" +saved.getNombre()
        );
        bitacoraRepository.saveAndFlush(bitacora);
        logger.info("Insertando movimiento en la bitacora");
        return new ResponseEntity<>(
                new ApiResponse(saved, HttpStatus.OK.value(), "Categoría registrada!"),
                HttpStatus.OK
        );
    }

    //Actualización de categoria
    @Transactional
    public ResponseEntity<ApiResponse> updateCategoria(CategoriaBean categoria, Long id, Authentication authentication) {
        Optional<CategoriaBean> find = repository.findById(id);
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);

        if (find.isPresent()) {
            CategoriaBean cat = find.get();
            Optional<CategoriaBean> otherCat = repository.findByNombre(categoria.getNombre());
            if (otherCat.isPresent() && !otherCat.get().getId_categoria().equals(cat.getId_categoria())) {
                logger.warn("El nombre a reemplazar ya se encuentra registrado");
                return new ResponseEntity<>(
                        new ApiResponse(HttpStatus.BAD_REQUEST.value(), "El nombre ya está en uso por otra categoría", true),
                        HttpStatus.BAD_REQUEST
                );
            }

            String nombreAnterior = cat.getNombre();

            cat.setNombre(categoria.getNombre());
            cat.setDescripcion(categoria.getDescripcion());
            cat.setEstatus(categoria.getEstatus());

            repository.saveAndFlush(cat);

            logger.info("Se ha actualizado correctamente el nombre de la categoría :" +nombreAnterior + " Por: " + cat.getNombre());
            //PASO 2
            BitacoraBean bitacora = new BitacoraBean(
                    LocalDateTime.now(),
                    "PUT",
                    usuarioAutenticado,
                    "Se actualizado la información de la categoria con ID  "+ id
            );
            bitacoraRepository.saveAndFlush(bitacora);
            logger.info("Insertando movimiento en la bitacora");

            return new ResponseEntity<>(
                    new ApiResponse(cat, HttpStatus.OK.value(), "Actualizado exitosamente"),
                    HttpStatus.OK
            );
        }

        logger.warn("No ha sido posible localizar a la categoría con ID" + id);
        return new ResponseEntity<>(
                new ApiResponse(HttpStatus.NOT_FOUND.value(), "No encontrado!", true),
                HttpStatus.NOT_FOUND
        );
    }


    //habilitar/deshabilitar categoria
    public ResponseEntity<ApiResponse>changeStatus(Long id, Authentication authentication){
        Optional<CategoriaBean> find = repository.findById(id);
        UsuarioBean usuarioAutenticado = getUsuarioAutenticado(authentication);


        if(find.isPresent()){
            CategoriaBean cat = find.get();

            if(cat.getEstatus()){
                cat.setEstatus(false);
                repository.save(cat);
                logger.info("Se ha cambiado el estatus de la categoria por: Inactivo ");
                //PASO 2
                BitacoraBean bitacora = new BitacoraBean(
                        LocalDateTime.now(),
                        "PATCH",
                        usuarioAutenticado,
                        "Se cambiado el estado de la categoria " + cat.getNombre() + "Por Inactivo"
                );
                bitacoraRepository.saveAndFlush(bitacora);
                logger.info("Insertando movimiento en la bitacora");
                return new ResponseEntity<>(new ApiResponse(cat, HttpStatus.OK.value(), "Estado cambiado"), HttpStatus.OK);
            }

            cat.setEstatus(true);
            repository.save(cat);
            logger.info("Se ha cambiado el estatus de la categoria por: Activo ");
            //PASO 2
            BitacoraBean bitacora = new BitacoraBean(
                    LocalDateTime.now(),
                    "PATCH",
                    usuarioAutenticado,
                    "Se cambiado el estado de la categoria " + cat.getNombre() + "por Activo"
            );

            bitacoraRepository.saveAndFlush(bitacora);
            logger.info("Insertando movimiento en la bitacora");
            return new ResponseEntity<>(new ApiResponse(cat, HttpStatus.OK.value(), "Estado cambiado"), HttpStatus.OK);
        }

        logger.warn("La categoría con id: "+ id + " No ha sido localizada");
        return new ResponseEntity<>(
                new ApiResponse(HttpStatus.NOT_FOUND.value(), "No encontrado!", true),
                HttpStatus.NOT_FOUND
        );
    }

}
