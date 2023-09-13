package com.example.simple_todo_app.services;

import com.example.simple_todo_app.exceptions.InvalidEmailException;
import com.example.simple_todo_app.exceptions.MissingDataException;
import com.example.simple_todo_app.exceptions.PasswordTooShortException;
import com.example.simple_todo_app.exceptions.UserAlreadyExistsException;
import com.example.simple_todo_app.models.Role;
import com.example.simple_todo_app.models.User;
import com.example.simple_todo_app.models.dtos.AuthenticationResponse;
import com.example.simple_todo_app.models.dtos.LoginRequest;
import com.example.simple_todo_app.models.dtos.RegisterNewUserDTO;
import com.example.simple_todo_app.models.dtos.RegisterRequest;
import com.example.simple_todo_app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtServiceImpl jwtService;

    public RegisterNewUserDTO register(RegisterRequest request) {
        Optional<User> optionalUser = userRepo.findByEmail(request.getEmail());

        if (optionalUser.isPresent() && optionalUser.get().getEmail().equalsIgnoreCase(request.getEmail())) {
            throw new UserAlreadyExistsException();
        }
        validateRequest(request.getPassword(), request.getEmail());

        User user = User
                .builder()
                .userName(request.getUserName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepo.save(user);

        return RegisterNewUserDTO
                .builder()
                .email(user.getEmail())
                .userName(user.getUsername())
                .build();
    }

    public AuthenticationResponse login(LoginRequest login) {
        validateRequest(login.getPassword(), login.getEmail());
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword()));
        } catch (DisabledException e) {
            throw new DisabledException("User is disabled", e);
        }
        var user = userRepo.findByEmail(login.getEmail()).orElseThrow();
        String token = jwtService.generateAccessToken(user);
        userRepo.save(user);

        return AuthenticationResponse
                .builder()
                .accessToken(token)
                .build();
    }

    private void validateRequest(String password, String email) {
        if (password.length() < 5) {
            throw new PasswordTooShortException();
        }
        if (!email.contains("@") && !email.contains(".")) {
            throw new InvalidEmailException();
        }
        if (password.isEmpty() && email.isEmpty()) {
            throw new MissingDataException("Password and email");
        }
        if (password.isEmpty()) {
            throw new MissingDataException("Password");
        }
        if (email.isEmpty()) {
            throw new MissingDataException("Email");
        }
    }
}
