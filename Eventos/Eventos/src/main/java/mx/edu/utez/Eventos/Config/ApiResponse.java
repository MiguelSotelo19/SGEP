package mx.edu.utez.Eventos.Config;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.utez.Eventos.Model.Usuarios.UsuarioBean;
import org.springframework.http.HttpStatus;

import java.util.Map;

public class ApiResponse {
    private Object data;
    private int status; // antes: HttpStatus
    private Map<String, Object> user;
    private String message;
    private Boolean error = false;

    public ApiResponse(Object data, Map<String, Object> user, int status, String message) {
        this.data = data;
        this.user = user;
        this.status = status;
        this.message = message;
    }

    public ApiResponse(Object data, int status, String message) {
        this.data = data;
        this.status = status;
        this.message = message;
    }

    public ApiResponse(Object data, int status, String message, Boolean error) {
        this.data = data;
        this.status = status;
        this.message = message;
        this.error = error;
    }

    public ApiResponse(int status, String message, Boolean error) {
        this.status = status;
        this.message = message;
        this.error = error;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getError() {
        return error;
    }

    public void setError(Boolean error) {
        this.error = error;
    }

    public Map<String, Object> getUser() {
        return user;
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }
}