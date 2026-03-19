package com.example.simple_todo_app.exceptions;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends AppException{
    public UnauthorizedException() {
        super("You are not authorized to delete this task.", HttpStatus.NOT_ACCEPTABLE);
    }
}
