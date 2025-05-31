package mx.edu.utez.Eventos.Model.Categorias;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;

import java.util.Set;

@Entity
@Table(name = "categorias")
public class CategoriaBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_categoria;

    @Column(unique = true)
    private String nombre;

    @Column(length = 250)
    private String descripcion;

    @Column
    private Boolean estatus;

    @OneToMany(mappedBy = "categoriaBean", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference  // <-- agrega esta línea
    private Set<EventosBean> eventos;

    public CategoriaBean(String nombre, String descripcion, Boolean estatus) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estatus = estatus;
    }



    public Long getId_categoria() {
        return id_categoria;
    }

    public void setId_categoria(Long id_categoria) {
        this.id_categoria = id_categoria;
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

    public CategoriaBean() {
    }
}
