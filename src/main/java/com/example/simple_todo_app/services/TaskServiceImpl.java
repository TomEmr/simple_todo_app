package com.example.simple_todo_app.services;

import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public Task createTask(CreateNewTaskDTO taskDTO) {

        if (taskDTO.getName() == null || taskDTO.getName().isEmpty()) {
            throw new IllegalArgumentException("Task name cannot be empty");
        }
        if (taskDTO.getDescription() == null || taskDTO.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Task description cannot be empty");
        }
        if (taskDTO.getName().length() > 50) {
            throw new IllegalArgumentException("Task name cannot be longer than 50 characters");
        }
        Task task = Task.builder()
                .name(taskDTO.getName())
                .description(taskDTO.getDescription())
                .completed(false)
                .build();
        taskRepository.save(task);
        return task;
    }
}
