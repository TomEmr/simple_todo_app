package com.example.simple_todo_app.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RegisterNewUserDTO {

    private String email;
    private String userName;
}
