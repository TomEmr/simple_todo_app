package com.example.simple_todo_app.services;

import com.example.simple_todo_app.models.dtos.AuthenticationResponse;
import com.example.simple_todo_app.models.dtos.LoginRequest;
import com.example.simple_todo_app.models.dtos.RegisterNewUserDTO;
import com.example.simple_todo_app.models.dtos.RegisterRequest;

public interface AuthenticationService {
    RegisterNewUserDTO register(RegisterRequest request);
    AuthenticationResponse login(LoginRequest login);
}
