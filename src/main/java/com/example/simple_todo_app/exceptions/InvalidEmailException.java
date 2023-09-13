package com.example.simple_todo_app.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidEmailException extends AppException {

        public InvalidEmailException() {
            super("Invalid email", HttpStatus.NOT_ACCEPTABLE);
        }
}
