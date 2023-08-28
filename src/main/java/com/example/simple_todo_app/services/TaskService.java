package com.example.simple_todo_app.services;

import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;

public interface TaskService {

    Task createTask(CreateNewTaskDTO taskDTO);
}
