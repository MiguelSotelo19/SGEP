package mx.edu.utez.Eventos.Controller.Categorias;

import lombok.AllArgsConstructor;
import mx.edu.utez.Eventos.Config.ApiResponse;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaRepository;
import mx.edu.utez.Eventos.Model.Categorias.DTO.CategoriaDTO;
import mx.edu.utez.Eventos.Service.Categorias.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.plaf.SpinnerUI;

@RestController
@CrossOrigin(origins = {"*"})
@RequestMapping("/api/categoria" )
public class CategoriasController {

    @Autowired
    private CategoriaService service;

    @Autowired
    private CategoriaRepository repository;
    @GetMapping(value = "/")
   public ResponseEntity<ApiResponse> categorias(){
        return  new ResponseEntity<>(new ApiResponse(service.getAllCategorias(), HttpStatus.OK.value(), "ok"), HttpStatus.OK);
    }

    @GetMapping("/true")
    public ResponseEntity<ApiResponse>categoriasTrue(){
        return new ResponseEntity<>(new ApiResponse(service.getAllCategoriasTrue(), HttpStatus.OK.value(), "ok"), HttpStatus.OK);
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse> nuevaCategoria(@RequestBody CategoriaDTO dto){
        System.out.println("nombre: "+ dto.getNombre());
        return service.newCategoria(dto.toEntity());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> actualizarCategoria(@RequestBody CategoriaDTO dto, @PathVariable Long id){
        return  service.updateCategoria(dto.toUpdate(),id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse>cambiarEstado(@PathVariable Long id){
        return service.changeStatus(id);
    }
}
