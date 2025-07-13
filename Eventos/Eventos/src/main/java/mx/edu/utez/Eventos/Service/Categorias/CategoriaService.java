package mx.edu.utez.Eventos.Service.Categorias;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;
import mx.edu.utez.Eventos.Model.Categorias.DTO.CategoriaDTO;
import mx.edu.utez.Eventos.Service.Usuarios.UsuarioService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ResponseBody;
import org.slf4j.Logger;

import java.sql.SQLException;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class CategoriaService {
    private static final Logger logger = LoggerFactory.getLogger(CategoriaService.class);

    @Autowired
    private CategoriaRepository repository;

    //listado de todas las categorias
    @Transactional(readOnly = true)
    public ApiResponse getAllCategorias() {
        logger.info("Se han obtenido todas las categorías");
        return new ApiResponse(repository.findAll(), HttpStatus.OK.value(), "OK");
    }

    //listado de las categorias activas
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse>getAllCategoriasTrue(){
        logger.info("Se han obtenido a las categorias con estatus activo");
        return new ResponseEntity<>(new ApiResponse(repository.findAllByEstatusTrue(), HttpStatus.OK.value(), "Ok"), HttpStatus.OK);
    }

    //registro de nueva categoria (obviamente sin eventos)
    @Transactional(rollbackFor = {SQLException.class})
    public ResponseEntity<ApiResponse> newCategoria(CategoriaBean categoria) {
        Optional<CategoriaBean> find = repository.findByNombre(categoria.getNombre());
        if (find.isPresent()) {
            logger.info("La categoria : " +categoria.getNombre() +" Ya se encuentra registrada");
            return new ResponseEntity<>(
                    new ApiResponse(HttpStatus.BAD_REQUEST.value(), "Ya está registrado", true),
                    HttpStatus.BAD_REQUEST
            );
        }


        CategoriaBean saved = repository.saveAndFlush(categoria);
        logger.info("Registrando la nueva categoria de nombre: " +saved.getNombre());
        return new ResponseEntity<>(
                new ApiResponse(saved, HttpStatus.OK.value(), "Categoría registrada!"),
                HttpStatus.OK
        );
    }

    //Actualización de categoria
    @Transactional
    public ResponseEntity<ApiResponse> updateCategoria(CategoriaBean categoria, Long id) {
        Optional<CategoriaBean> find = repository.findById(id);

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

            repository.saveAndFlush(cat);
            logger.info("Se ha actualizado correctamente el nombre de la categoría :" +nombreAnterior + " Por: " + cat.getNombre());
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
    public ResponseEntity<ApiResponse>changeStatus(Long id){
        Optional<CategoriaBean> find = repository.findById(id);

        if(find.isPresent()){
            CategoriaBean cat = find.get();

            if(cat.getEstatus()){
                cat.setEstatus(false);
                repository.save(cat);
                logger.info("Se ha cambiado el estatus de la categoria por: Inactivo ");
                return new ResponseEntity<>(new ApiResponse(cat, HttpStatus.OK.value(), "Estado cambiado"), HttpStatus.OK);
            }

            cat.setEstatus(true);
            repository.save(cat);
            logger.info("Se ha cambiado el estatus de la categoria por: Activo ");
            return new ResponseEntity<>(new ApiResponse(cat, HttpStatus.OK.value(), "Estado cambiado"), HttpStatus.OK);
        }

        logger.warn("La categoría con id: "+ id + " No ha sido localizada");
        return new ResponseEntity<>(
                new ApiResponse(HttpStatus.NOT_FOUND.value(), "No encontrado!", true),
                HttpStatus.NOT_FOUND
        );
    }

}
