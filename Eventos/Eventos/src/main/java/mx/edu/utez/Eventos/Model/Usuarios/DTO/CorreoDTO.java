package mx.edu.utez.Eventos.Model.Usuarios.DTO;

import jakarta.validation.constraints.NotBlank;

public class CorreoDTO {
    @NotBlank
    private String correo;

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public CorreoDTO() {
    }
}
