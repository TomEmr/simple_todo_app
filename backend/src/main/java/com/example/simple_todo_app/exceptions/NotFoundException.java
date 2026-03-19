package com.example.simple_todo_app.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends AppException{
    public NotFoundException(String missingValue) {
        super(missingValue + " is not found!", HttpStatus.NOT_FOUND);
    }
}
