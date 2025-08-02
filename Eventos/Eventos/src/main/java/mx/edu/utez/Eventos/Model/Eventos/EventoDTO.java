package mx.edu.utez.Eventos.Model.Eventos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class EventoDTO {
    @NotBlank(groups = {Register.class, Modify.class})
    private String nombre_evento;
    @NotBlank(groups = {Register.class, Modify.class})
    private String lugar;
    @NotNull(groups = {Register.class, Modify.class})
    private LocalDate fecha;
    @NotNull(groups = {Register.class, Modify.class})
    private Long limite_usuarios;
    @NotNull(groups = {Register.class, Modify.class})
    private Long id_categoria;
    @NotBlank(groups = {Register.class, Modify.class})
    private String tipo_evento;

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

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Long getId_categoria() {
        return id_categoria;
    }

    public void setId_categoria(Long id_categoria) {
        this.id_categoria = id_categoria;
    }

    public String getTipo_evento() {
        return tipo_evento;
    }

    public void setTipo_evento(String tipo_evento) {
        this.tipo_evento = tipo_evento;
    }

    public Long getLimite_usuarios() {
        return limite_usuarios;
    }

    public void setLimite_usuarios(Long limite_usuarios) {
        this.limite_usuarios = limite_usuarios;
    }

    public interface Register{}
    public interface Modify{}

    public interface ChangeStatus{}
}
