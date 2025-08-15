package mx.edu.utez.Eventos.Model.Eventos;

import java.time.LocalDate;

public class EventoResponseDTO {
    private Long id_evento;
    private String nombre_evento;
    private String lugar;
    private String tipo_evento;
    private LocalDate fecha;
    private Boolean estatus;
    private Long limite_usuarios;
    private Long id_categoria;
    private String codigo;

    public EventoResponseDTO(EventosBean evento) {
        this.id_evento = evento.getId_evento();
        this.nombre_evento = evento.getNombre_evento();
        this.lugar = evento.getLugar();
        this.tipo_evento = evento.getTipo_evento();
        this.fecha = evento.getFecha();
        this.estatus = evento.getEstatus();
        this.limite_usuarios = evento.getLimite_usuarios();
        this.id_categoria = evento.getCategoriaBean().getId_categoria(); // ◄ Extrae solo el ID
        this.codigo = evento.getCodigo();
    }

    public String getNombre_evento() {
        return nombre_evento;
    }

    public String getLugar() {
        return lugar;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public Long getId_categoria() {
        return id_categoria;
    }

    public String getTipo_evento() {
        return tipo_evento;
    }

    public Long getLimite_usuarios() {
        return limite_usuarios;
    }

    public Long getId_evento() {
        return id_evento;
    }

    public Boolean getEstatus() {
        return estatus;
    }

    public String getCodigo() {
        return codigo;
    }
}
