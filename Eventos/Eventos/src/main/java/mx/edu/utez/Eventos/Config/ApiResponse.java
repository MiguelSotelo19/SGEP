package mx.edu.utez.Eventos.Config;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ApiResponse {
    /*ESTE PODRIA QUEDAR COMO EL PATRON DE DISEÑO FACTORY METHOD*/
    private Object object;
    private HttpStatus status;
    private String message;
    private Boolean error;

    public ApiResponse(Object object, HttpStatus status, String message) {
        this.object = object;
        this.status = status;
        this.message = message;
    }

    public ApiResponse(HttpStatus status, String message, Boolean error) {
        this.status = status;
        this.message = message;
        this.error = error;
    }
}
