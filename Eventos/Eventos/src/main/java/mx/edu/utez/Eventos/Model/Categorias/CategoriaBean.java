package mx.edu.utez.Eventos.Model.Categorias;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;

import java.util.Set;

@Entity
@Table(name = "categorias")
@Data
public class CategoriaBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_caregoria;

    @Column
    private String nombre_categoria;

    @Column(length = 250)
    private String descripcion;

    @Column
    private int limite_participantes;

    @Column
    private Boolean estatus;

    @OneToMany(mappedBy = "categoriaBean", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private Set<EventosBean> eventos;


}
