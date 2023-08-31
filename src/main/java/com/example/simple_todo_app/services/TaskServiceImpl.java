package com.example.simple_todo_app.services;

import com.example.simple_todo_app.exceptions.MissingDataException;
import com.example.simple_todo_app.exceptions.OverExtendedLengthException;
import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.models.dtos.TaskDTO;
import com.example.simple_todo_app.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Override
    public Task createTask(CreateNewTaskDTO taskDTO) {

        if (taskDTO.getTitle() == null || taskDTO.getTitle().isEmpty()) {
            throw new MissingDataException("Task title");
        }
        if (taskDTO.getTitle().length() > 50) {
            throw new OverExtendedLengthException("Title");
        }
        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .completed(false)
                .build();
        taskRepository.save(task);
        return task;
    }

    @Override
    public List<TaskDTO> getAllTasksByStatus(String status) {
        List<Task> tasks;

        if ("completed".equals(status)) {
            tasks = taskRepository.findAllByCompletedTrue();
        } else if ("active".equals(status)) {
            tasks = taskRepository.findAllByCompletedFalse();
        } else {
            tasks = taskRepository.findAll();
        }

        return tasks.stream().map(TaskDTO::new).toList();
    }

    @Override
    @Transactional
    public void deleteAllCompletedTasks() {
        taskRepository.deleteAllByCompletedTrue();
    }
}
