package com.example.simple_todo_app.services;

import com.example.simple_todo_app.exceptions.*;
import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.User;
import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.models.dtos.TaskDTO;
import com.example.simple_todo_app.repositories.TaskRepository;
import com.example.simple_todo_app.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public Task createTask(CreateNewTaskDTO taskDTO) {

        if (taskDTO.getTitle() == null || taskDTO.getTitle().isEmpty()) {
            throw new MissingDataException("Task title");
        }

        if (taskDTO.getTitle().length() > 50) {
            throw new OverExtendedLengthException("Title");
        }

        User user = getAuthenticatedUser();

        Task task = Task.builder()
                .title(taskDTO.getTitle())
                .user(user)
                .completed(false)
                .build();

        taskRepository.save(task);
        return task;
    }

    public List<TaskDTO> getAllTasksByStatus(String status) {
        List<Task> tasks;

        User user = getAuthenticatedUser();

        if ("completed".equals(status)) {
            tasks = taskRepository.findAllByUserAndCompletedTrue(user);

        } else if ("active".equals(status)) {
            tasks = taskRepository.findAllByUserAndCompletedFalse(user);

        } else {
            tasks = taskRepository.findAllByUser(user);
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

    public void deleteById(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isEmpty()) {
            throw new NotFoundException("Task with id " + id);
        }
        Task taskToDelete = task.get();
        User user = getAuthenticatedUser();
        if (!taskToDelete.getUser().equals(user)) {
            throw new UnauthorizedException();
        }

        taskRepository.delete(taskToDelete);
    }

    public Task updateTitleById(Long id, String newTitle) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isEmpty()) {
            throw new NotFoundException("Task with id " + id);
        }
        if (newTitle == null || newTitle.isEmpty()) {
            throw new MissingDataException("Task title");
        }
        if (newTitle.length() > 50) {
            throw new OverExtendedLengthException("Title");
        }
        Task taskToUpdate = task.get();
        User user = getAuthenticatedUser();
        if (!taskToUpdate.getUser().equals(user)) {
            throw new UnauthorizedException();
        }
        taskToUpdate.setTitle(newTitle);
        taskRepository.save(taskToUpdate);
        return taskToUpdate;
    }

    public Task updateCompletedById(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        if (task.isEmpty()) {
            throw new NotFoundException("Task with id " + id);
        }
        Task taskToUpdate = task.get();
        User user = getAuthenticatedUser();
        if (!taskToUpdate.getUser().equals(user)) {
            throw new UnauthorizedException();
        }
        taskToUpdate.setCompleted(!taskToUpdate.getCompleted());
        taskRepository.save(taskToUpdate);
        return taskToUpdate;
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userEmail = authentication.getName();

        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User with email " + userEmail));
    }
}
