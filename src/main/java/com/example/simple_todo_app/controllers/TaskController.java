package com.example.simple_todo_app.controllers;

import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.models.dtos.TaskDTO;
import com.example.simple_todo_app.models.dtos.TaskTitleUpdateDTO;
import com.example.simple_todo_app.services.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody CreateNewTaskDTO taskDTORequest) {
        return ResponseEntity.ok().body(new TaskDTO(taskService.createTask(taskDTORequest)));
    }

    @GetMapping
    public ResponseEntity<?> getAllTasks(@RequestParam(required = false) String status) {
        return ResponseEntity.ok().body(taskService.getAllTasksByStatus(status));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAllCompletedTasks() {
        taskService.deleteAllCompletedTasks();
        return ResponseEntity.ok().body("All completed tasks deleted.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTaskById(@PathVariable Long id) {
        taskService.deleteById(id);
        return ResponseEntity.ok().body("Task with id " + id + " deleted.");
    }

    @PatchMapping("/{id}/title")
    public ResponseEntity<?> updateTaskTitleById(@PathVariable Long id, @RequestBody TaskTitleUpdateDTO taskTitleUpdateDTO) {
        return ResponseEntity.ok().body(new TaskDTO(taskService.updateTitleById(id, taskTitleUpdateDTO.getTitle())));
    }

    @PatchMapping("/{id}/completed")
    public ResponseEntity<?> updateTaskCompletedById(@PathVariable Long id) {
        return ResponseEntity.ok().body(new TaskDTO(taskService.updateCompletedById(id)));
    }

}
