package mx.edu.utez.Eventos.Model.Categorias;

import jakarta.persistence.*;
import lombok.Data;
import mx.edu.utez.Eventos.Model.Eventos.EventosBean;

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

    @OneToOne
    @JoinColumn(name = "id_evento")
    private EventosBean eventosBean;


}
