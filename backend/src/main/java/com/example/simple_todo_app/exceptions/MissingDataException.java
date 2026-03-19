package com.example.simple_todo_app.exceptions;

import org.springframework.http.HttpStatus;

public class MissingDataException extends AppException {

    public MissingDataException(String message) {
        super("You are missing required field(s): " + message, HttpStatus.BAD_REQUEST);
    }
}
