package com.example.simple_todo_app.controllers;

import com.example.simple_todo_app.models.dtos.AuthenticationResponse;
import com.example.simple_todo_app.models.dtos.RegisterRequest;
import com.example.simple_todo_app.models.dtos.LoginRequest;
import com.example.simple_todo_app.services.AuthenticationServiceImpl;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationServiceImpl authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        AuthenticationResponse authenticationResponse = authService.login(loginRequest);
        Cookie cookie = new Cookie("accessToken", authenticationResponse.getAccessToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(1000 * 60 * 60 * 24);
        cookie.setSecure(false);
        response.addCookie(cookie);
        return ResponseEntity.ok(authenticationResponse);
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse httpResponse) {
        Cookie cookie = new Cookie("accessToken", "");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        httpResponse.addCookie(cookie);
        return ResponseEntity.ok().body("Successfully logged out");
    }
}
