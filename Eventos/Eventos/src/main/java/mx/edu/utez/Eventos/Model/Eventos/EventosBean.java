package mx.edu.utez.Eventos.Model.Eventos;

import jakarta.persistence.*;
import lombok.Data;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Participantes.ParticipantesBean;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "eventos")
@Data
public class EventosBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_evento;

    @Column
    private String nombre_evento;

    @Column
    private String lugar;

    @Column(columnDefinition = "DATE")
    private LocalDate fecha;

    @Column
    private Boolean estatus;

    @OneToMany(mappedBy = "evento", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ParticipantesBean> participantes;

    @OneToOne
    @JoinColumn(name = "id_categoria")
    private CategoriaBean categoriaBean;
}
