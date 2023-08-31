package com.example.simple_todo_app.controllers;

import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.repositories.TaskRepository;
import com.example.simple_todo_app.services.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("Post request to create a new task")
    void createTask() throws Exception {
        CreateNewTaskDTO requestDTO = new CreateNewTaskDTO();
        requestDTO.setTitle("Sample Task");

        mockMvc.perform(MockMvcRequestBuilders
                        .post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(requestDTO)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Sample Task"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.completed").value(false))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andReturn();

    }

    @Test
    @DisplayName("Get request to get all tasks")
    void getAllTasks() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray())
                .andReturn();

        assertEquals("[]", mvcResult.getResponse().getContentAsString());
    }

    @Test
    @DisplayName("Delete request to delete all completed tasks")
    void deleteAllCompletedTasks() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders
                        .delete("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
    }

}