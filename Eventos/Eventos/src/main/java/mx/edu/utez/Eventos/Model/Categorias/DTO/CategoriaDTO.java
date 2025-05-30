package mx.edu.utez.Eventos.Model.Categorias.DTO;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;

import java.util.Set;
public class CategoriaDTO {
    private String nombre;

    private String descripcion;

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
}
