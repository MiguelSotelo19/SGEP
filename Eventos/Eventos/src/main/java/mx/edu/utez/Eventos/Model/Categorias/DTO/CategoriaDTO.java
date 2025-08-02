package mx.edu.utez.Eventos.Model.Categorias.DTO;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;

import java.util.Set;
public class CategoriaDTO {

    @NotBlank(groups = {Register.class, Modify.class})
    private String nombre;
    @NotBlank(groups = {Register.class, Modify.class})
    private String descripcion;

    @NotNull(groups = {Register.class, Modify.class})
    private Boolean estatus;

    private Set<EventosBean> eventos;

    public CategoriaBean toEntity(){
        return new CategoriaBean(nombre,descripcion,estatus);
    }

    public CategoriaBean toUpdate(){
        return new CategoriaBean(nombre,descripcion,estatus);
    }



    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public Set<EventosBean> getEventos() {
        return eventos;
    }

    public void setEventos(Set<EventosBean> eventos) {
        this.eventos = eventos;
    }

    public CategoriaDTO() {
    }

    public interface Register{}
    public interface Modify{}
}
