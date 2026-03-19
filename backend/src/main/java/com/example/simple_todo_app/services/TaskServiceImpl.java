package com.example.simple_todo_app.services;

import com.example.simple_todo_app.exceptions.*;
import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.User;
import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.models.dtos.TaskDTO;
import com.example.simple_todo_app.models.dtos.TaskTitleUpdateDTO;
import com.example.simple_todo_app.repositories.TaskRepository;
import com.example.simple_todo_app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskDTO createTask(CreateNewTaskDTO taskDTO) {

        if (taskDTO.getTitle() == null || taskDTO.getTitle().isEmpty()) {
            throw new MissingDataException("Task title");
        }

        if (taskDTO.getTitle().length() > 50) {
            throw new OverExtendedLengthException("Title");
        }

        User user = getAuthenticatedUser();
        int nextPosition = taskRepository.findMaxPositionByUser(user) + 1;

        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .user(user)
                .completed(false)
                .position(nextPosition)
                .build();

        taskRepository.save(task);
        return new TaskDTO(task);
    }

    public List<TaskDTO> getAllTasksByUser(String status) {
        List<Task> tasks;

        User user = getAuthenticatedUser();

        if ("completed".equals(status)) {
            tasks = taskRepository.findByUserAndCompletedOrderByPositionAsc(user, true);

        } else if ("active".equals(status)) {
            tasks = taskRepository.findByUserAndCompletedOrderByPositionAsc(user, false);

        } else {
            tasks = taskRepository.findByUserOrderByPositionAsc(user);
        }

        return tasks.stream().map(TaskDTO::new).toList();
    }

    @Transactional
    public void deleteAllCompletedTasks() {

        User user = getAuthenticatedUser();

        if (taskRepository.findAllByUserAndCompletedTrue(user).isEmpty()) {
            throw new EmptyListException("Completed tasks");
        }
        taskRepository.deleteAllByUserAndCompletedTrue(user);
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task with id " + id));
        User user = getAuthenticatedUser();
        if (!task.getUser().equals(user)) {
            throw new UnauthorizedException();
        }

        taskRepository.delete(task);
    }

    public TaskDTO updateTaskTitle(Long id, TaskTitleUpdateDTO taskTitleUpdateDTO) {
        String newTitle = taskTitleUpdateDTO.getTitle();
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task with id " + id));
        if (newTitle == null || newTitle.isEmpty()) {
            throw new MissingDataException("Task title");
        }
        if (newTitle.length() > 50) {
            throw new OverExtendedLengthException("Title");
        }
        User user = getAuthenticatedUser();
        if (!task.getUser().equals(user)) {
            throw new UnauthorizedException();
        }
        task.setTitle(newTitle);
        taskRepository.save(task);
        return new TaskDTO(task);
    }

    public TaskDTO updateTaskCompleted(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task with id " + id));
        User user = getAuthenticatedUser();
        if (!task.getUser().equals(user)) {
            throw new UnauthorizedException();
        }
        task.setCompleted(!task.isCompleted());
        taskRepository.save(task);
        return new TaskDTO(task);
    }

    @Transactional
    public void reorderTasks(List<Long> taskIds) {
        User user = getAuthenticatedUser();

        for (int i = 0; i < taskIds.size(); i++) {
            Task task = taskRepository.findById(taskIds.get(i))
                    .orElseThrow(() -> new NotFoundException("Task"));
            if (!task.getUser().equals(user)) {
                throw new UnauthorizedException();
            }
            task.setPosition(i);
            taskRepository.save(task);
        }
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userEmail = authentication.getName();

        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User with email " + userEmail));
    }
}
