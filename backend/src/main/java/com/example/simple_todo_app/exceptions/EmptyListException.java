package com.example.simple_todo_app.exceptions;

import org.springframework.http.HttpStatus;

public class EmptyListException extends AppException{
    public EmptyListException(String message) {
        super("List is empty: " + message, HttpStatus.BAD_REQUEST);
    }

}
