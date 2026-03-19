package com.example.simple_todo_app.models.dtos;

import lombok.Data;
import org.springframework.http.HttpStatusCode;

import java.util.Date;

@Data
public class ErrorDTO {
    private HttpStatusCode statusCode;
    private String message;
    private final Date timestamp = new Date();

    public ErrorDTO(HttpStatusCode statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}
