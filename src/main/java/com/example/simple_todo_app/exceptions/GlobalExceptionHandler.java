package com.example.simple_todo_app.exceptions;

import com.example.simple_todo_app.models.dtos.ErrorDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorDTO> handleAppException(AppException ex) {
        return ResponseEntity.status(ex.getHttpStatus()).body(createErrorDTO(ex));
    }

    @ExceptionHandler(MissingDataException.class)
    public ResponseEntity<ErrorDTO> handleMissingDataException(MissingDataException ex) {
        return ResponseEntity.status(ex.getHttpStatus()).body(createErrorDTO(ex));
    }

    @ExceptionHandler(OverExtendedLengthException.class)
    public ResponseEntity<ErrorDTO> handleOverExtendedLengthException(OverExtendedLengthException ex) {
        return ResponseEntity.status(ex.getHttpStatus()).body(createErrorDTO(ex));
    }

    private ErrorDTO createErrorDTO(AppException ex) {
        return new ErrorDTO(
                ex.getHttpStatus(),
                ex.getMessage()
        );
    }
}
