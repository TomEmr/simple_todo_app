package com.example.simple_todo_app.exceptions;

import org.springframework.http.HttpStatus;

public class OverExtendedLengthException extends AppException{

        public OverExtendedLengthException(String message) {
            super("You have exceeded the maximum length of 50 characters for the following field(s): " + message, HttpStatus.BANDWIDTH_LIMIT_EXCEEDED);
        }
}
