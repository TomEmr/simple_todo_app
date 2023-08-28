package com.example.simple_todo_app.controllers;

import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.models.dtos.TaskDTO;
import com.example.simple_todo_app.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping(produces = "application/json", consumes = "application/json")
    public ResponseEntity<?> createTask(@RequestBody CreateNewTaskDTO taskDTORequest) {

        return ResponseEntity.ok().body(new TaskDTO(taskService.createTask(taskDTORequest)));
    }
}
