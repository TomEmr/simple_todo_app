package com.example.simple_todo_app.services;

import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.models.dtos.TaskDTO;

import java.util.List;

public interface TaskService {

    Task createTask(CreateNewTaskDTO taskDTO);

    List<TaskDTO> getAllTasks();

    List<TaskDTO> getAllCompletedTasks();

    List<TaskDTO> getAllActiveTasks();
}
