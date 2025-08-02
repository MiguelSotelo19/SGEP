package mx.edu.utez.Eventos.Model.Bitacora;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora")
public class BitacoraBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String movimiento;

    @Column(columnDefinition = "DATE")
    @CreationTimestamp
    private LocalDateTime fecha;

    @Column(length = 255)
    private String descripcion;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_id_persona")
    private UsuarioBean persona;

    @JsonProperty("nombreUsuario")
    public String getNombreUsuario() {
        return persona != null ? persona.getNombre() : "Desconocido";
    }

    public BitacoraBean(LocalDateTime fechamovimiento, String movimiento, UsuarioBean persona, String descripcion) {
        this.fecha = fechamovimiento;
        this.movimiento = movimiento;
        this.persona = persona;
        this.descripcion = descripcion;
    }

    public BitacoraBean(Long id, String movimiento, LocalDateTime fecha, String descripcion, UsuarioBean persona) {
        this.id = id;
        this.movimiento = movimiento;
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.persona = persona;
    }

    public BitacoraBean() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMovimiento() {
        return movimiento;
    }

    public void setMovimiento(String movimiento) {
        this.movimiento = movimiento;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public UsuarioBean getPersona() {
        return persona;
    }

    public void setPersona(UsuarioBean persona) {
        this.persona = persona;
    }
}
