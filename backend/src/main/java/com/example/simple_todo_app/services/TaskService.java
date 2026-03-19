package com.example.simple_todo_app.services;

import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.models.dtos.TaskDTO;
import com.example.simple_todo_app.models.dtos.TaskTitleUpdateDTO;

import java.util.List;

public interface TaskService {
    TaskDTO createTask(CreateNewTaskDTO taskDTO);
    List<TaskDTO> getAllTasksByUser(String status);
    TaskDTO updateTaskTitle(Long id, TaskTitleUpdateDTO taskTitleUpdateDTO);
    TaskDTO updateTaskCompleted(Long id);
    void deleteTask(Long id);
    void deleteAllCompletedTasks();
    void reorderTasks(List<Long> taskIds);
}
