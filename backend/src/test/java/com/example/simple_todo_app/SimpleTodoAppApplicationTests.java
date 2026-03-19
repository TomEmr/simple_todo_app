package com.example.simple_todo_app;

import com.example.simple_todo_app.services.JwtServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class SimpleTodoAppApplicationTests {

    @MockBean
    private JwtServiceImpl jwtService;
    @Test
    void contextLoads() {
    }

}
