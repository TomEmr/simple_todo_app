package com.example.simple_todo_app.services;

import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.models.dtos.TaskDTO;

import java.util.List;

public interface TaskService {

    Task createTask(CreateNewTaskDTO taskDTO);

    List<TaskDTO> getAllTasksByStatus(String status);

    void deleteAllCompletedTasks();

    Task deleteById(Long id);

    Task updateTitleById(Long id, String newTitle);

    Task updateCompletedById(Long id);

}
