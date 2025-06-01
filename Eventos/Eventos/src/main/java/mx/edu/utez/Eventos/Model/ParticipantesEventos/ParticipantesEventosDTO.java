package mx.edu.utez.Eventos.Model.ParticipantesEventos;

public class ParticipantesEventosDTO {
    private Long idUsuario;
    private Long idEvento;

    public  Long getIdUsuario(){
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdEvento(){
        return idEvento;
    }
    public void setIdEvento(Long idEvento){
        this.idEvento=idEvento;
    }
}
