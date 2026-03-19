package com.example.simple_todo_app.services;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String extractUserEmailFromAccessToken(String jwtToken);
    String generateAccessToken(UserDetails userDetails);
    boolean isTokenValid(String token, UserDetails userDetails);
}
