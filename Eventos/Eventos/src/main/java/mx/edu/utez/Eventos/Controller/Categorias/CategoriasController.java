package mx.edu.utez.Eventos.Controller.Categorias;

import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;
import mx.edu.utez.Eventos.Model.Categorias.DTO.CategoriaDTO;
import mx.edu.utez.Eventos.Model.Categorias.DTO.CategoriaDTO.Modify;
import mx.edu.utez.Eventos.Service.Categorias.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/api/categoria" )
public class CategoriasController {

    @Autowired
    private CategoriaService service;

    @Autowired
    private CategoriaRepository repository;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.toList());

        return new ResponseEntity<>(
                new ApiResponse(null, 400, "Errores de validación: " + String.join("; ", errors)),
                HttpStatus.BAD_REQUEST
        );
    }

    @GetMapping(value = "/")
    public ResponseEntity<ApiResponse> categorias(){
        return  new ResponseEntity<>(new ApiResponse(service.getAllCategorias(), HttpStatus.OK.value(), "ok"), HttpStatus.OK);
    }

    @GetMapping("/true")
    public ResponseEntity<ApiResponse>categoriasTrue(){
        return new ResponseEntity<>(new ApiResponse(service.getAllCategoriasTrue(), HttpStatus.OK.value(), "ok"), HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> nuevaCategoria(@Validated(CategoriaDTO.Register.class) @RequestBody CategoriaDTO dto){
        return service.newCategoria(dto.toEntity());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> actualizarCategoria(@Validated(CategoriaDTO.Modify.class) @RequestBody CategoriaDTO dto, @PathVariable Long id){
        return  service.updateCategoria(dto.toUpdate(),id);
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<ApiResponse>cambiarEstado(@PathVariable Long id){
        return service.changeStatus(id);
    }
}
