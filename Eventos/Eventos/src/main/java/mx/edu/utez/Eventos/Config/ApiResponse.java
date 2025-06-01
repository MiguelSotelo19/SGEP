package mx.edu.utez.Eventos.Config;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

public class ApiResponse {
    private Object data;
    private int status; // antes: HttpStatus
    private String message;
    private Boolean error = false;

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
}
