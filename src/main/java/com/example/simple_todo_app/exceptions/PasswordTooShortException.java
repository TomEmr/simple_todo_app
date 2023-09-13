package com.example.simple_todo_app.exceptions;

public class PasswordTooShortException extends AppException {

        public PasswordTooShortException() {
            super("Minimum password length is 5 characters");
        }
}
