package com.example.simple_todo_app.exceptions;

import org.springframework.http.HttpStatus;

public class UserAlreadyExistsException extends AppException {

    public UserAlreadyExistsException() {
        super("User already exists", HttpStatus.BAD_REQUEST);
    }
}
