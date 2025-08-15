package mx.edu.utez.Eventos.Model.Eventos;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import mx.edu.utez.Eventos.Model.Categorias.CategoriaBean;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "eventos")
public class EventosBean {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_evento;

    @Column
    private String nombre_evento;

    @Column
    private String lugar;

    @Column
    private String tipo_evento;

    @Column(columnDefinition = "DATE")
    private LocalDate fecha;

    @Column
    private Boolean estatus;

    @Column
    private Long limite_usuarios;

    @Column
    private String codigo;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(
            name = "evento_usuario",
            joinColumns = @JoinColumn(name = "id_evento"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    private Set<UsuarioBean> usuarios = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "id_categoria")
    @JsonBackReference  // <-- para evitar ciclos de serialización
    private CategoriaBean categoriaBean;

    public Long getId_evento() {
        return id_evento;
    }

    public void setId_evento(Long id_evento) {
        this.id_evento = id_evento;
    }

    public String getNombre_evento() {
        return nombre_evento;
    }

    public void setNombre_evento(String nombre_evento) {
        this.nombre_evento = nombre_evento;
    }

    public String getLugar() {
        return lugar;
    }

    public void setLugar(String lugar) {
        this.lugar = lugar;
    }

    public String getTipo_evento() {
        return tipo_evento;
    }

    public void setTipo_evento(String tipo_evento) {
        this.tipo_evento = tipo_evento;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public void setEstatus(Boolean estatus) {
        this.estatus = estatus;
    }

    public CategoriaBean getCategoriaBean() {
        return categoriaBean;
    }

    public void setCategoriaBean(CategoriaBean categoriaBean) {
        this.categoriaBean = categoriaBean;
    }

    public Long getLimite_usuarios() {
        return limite_usuarios;
    }

    public void setLimite_usuarios(Long limite_usuarios) {
        this.limite_usuarios = limite_usuarios;
    }

    public Set<UsuarioBean> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(Set<UsuarioBean> usuarios) {
        this.usuarios = usuarios;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
}
