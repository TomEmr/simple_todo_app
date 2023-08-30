package com.example.simple_todo_app.services;

import com.example.simple_todo_app.exceptions.MissingDataException;
import com.example.simple_todo_app.exceptions.OverExtendedLengthException;
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

        if (taskDTO.getTitle() == null || taskDTO.getTitle().isEmpty()) {
            throw new MissingDataException("Task title");
        }

        String description = taskDTO.getDescription() != null ? taskDTO.getDescription() : "";

        if (taskDTO.getTitle().length() > 50) {
            throw new OverExtendedLengthException("Title");
        }
        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .description(description)
                .completed(false)
                .build();
        taskRepository.save(task);
        return task;
    }
}
