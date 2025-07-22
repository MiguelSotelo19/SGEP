package mx.edu.utez.Eventos.Model.Usuarios.DTO;

import jakarta.validation.constraints.NotBlank;

public class PasswordDTO {
    @NotBlank
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public PasswordDTO() {
    }
}
