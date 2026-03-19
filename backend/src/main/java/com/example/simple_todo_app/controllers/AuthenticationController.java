package com.example.simple_todo_app.controllers;

import com.example.simple_todo_app.models.dtos.AuthenticationResponse;
import com.example.simple_todo_app.models.dtos.RegisterRequest;
import com.example.simple_todo_app.models.dtos.LoginRequest;
import com.example.simple_todo_app.services.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private static final int COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day

    private final AuthenticationService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        AuthenticationResponse authenticationResponse = authService.login(loginRequest);
        String cookieValue = String.format(
                "accessToken=%s; Max-Age=%d; Path=/; HttpOnly; SameSite=Lax",
                authenticationResponse.getAccessToken(),
                COOKIE_MAX_AGE_SECONDS
        );
        response.addHeader("Set-Cookie", cookieValue);
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
