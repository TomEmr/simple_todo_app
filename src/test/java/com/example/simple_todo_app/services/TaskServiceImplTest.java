package com.example.simple_todo_app.services;

import com.example.simple_todo_app.exceptions.MissingDataException;
import com.example.simple_todo_app.exceptions.NotFoundException;
import com.example.simple_todo_app.exceptions.OverExtendedLengthException;
import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.dtos.CreateNewTaskDTO;
import com.example.simple_todo_app.repositories.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceImplTest {

    @InjectMocks
    private TaskServiceImpl taskService;

    @Mock
    private TaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        when(taskRepository.findAll()).thenReturn(List.of(
                Task.builder().id(1L).title("Task 1").completed(false).build(),
                Task.builder().id(2L).title("Task 2").completed(true).build(),
                Task.builder().id(3L).title("Task 3").completed(false).build(),
                Task.builder().id(4L).title("Task 4").completed(true).build(),
                Task.builder().id(5L).title("Task 5").completed(false).build()
        ));

        when(taskRepository.findAllByCompletedTrue()).thenReturn(List.of(
                Task.builder().id(2L).title("Task 2").completed(true).build(),
                Task.builder().id(4L).title("Task 4").completed(true).build()
        ));

        when(taskRepository.findAllByCompletedFalse()).thenReturn(List.of(
                Task.builder().id(1L).title("Task 1").completed(false).build(),
                Task.builder().id(3L).title("Task 3").completed(false).build(),
                Task.builder().id(5L).title("Task 5").completed(false).build()
        ));

    }

    @Test
    @DisplayName("Get all tasks")
    void getAllTasks() {
        assertEquals(5, taskService.getAllTasksByStatus(null).size());
        assertEquals(5, taskService.getAllTasksByStatus("").size());
    }

    @Test
    @DisplayName("Get all completed tasks")
    void getAllCompletedTasks() {
        assertEquals(2, taskService.getAllTasksByStatus("completed").size());
    }

    @Test
    @DisplayName("Get all active tasks")
    void getAllActiveTasks() {
        assertEquals(3, taskService.getAllTasksByStatus("active").size());
    }

    @Test
    @DisplayName("Delete all completed tasks")
    void deleteAllCompletedTasks() {
        taskService.deleteAllCompletedTasks();
        verify(taskRepository, times(1)).deleteAllByCompletedTrue();
    }

    @Test
    @DisplayName("Delete task by id")
    void deleteById() {
        Task task = Task.builder().id(1L).title("Task 1").completed(false).build();
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        taskService.deleteById(1L);
        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Update task title by id")
    void updateTitleById() {
        Task task = Task.builder().id(1L).title("Task 1").completed(false).build();
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);
        assertEquals("Task 2", taskService.updateTitleById(1L, "Task 2").getTitle());
    }

    @Test
    @DisplayName("Update task title by id with missing data")
    void updateTitleByIdWithMissingData() {
        Task task = Task.builder().id(1L).title("Task 1").completed(false).build();
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);
        assertThrows(MissingDataException.class, () -> taskService.updateTitleById(1L, ""));
    }

    @Test
    @DisplayName("Change task to completed by id")
    void updateCompletedById() {
        Task task = Task.builder().id(1L).title("Task 1").completed(false).build();
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(task)).thenReturn(task);
        assertEquals(true, taskService.updateCompletedById(1L).getCompleted());
    }

    @Test
    @DisplayName("Task not found exception")
    void taskNotFoundException() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> taskService.updateTitleById(1L, "Task 2"));
    }

    @Test
    @DisplayName("Create new task")
    void createTask() {
        CreateNewTaskDTO taskDTO = CreateNewTaskDTO.builder().title("Task 1").build();
        Task taskWithId = Task.builder().id(1L).title("Task 1").completed(false).build();
        when(taskRepository.save(any(Task.class))).thenReturn(taskWithId);
        Task savedTask = taskService.createTask(taskDTO);
        assertEquals(taskWithId.getTitle(), savedTask.getTitle());
    }

    @Test
    @DisplayName("Create new task with missing data")
    void createTaskWithMissingData() {
        CreateNewTaskDTO taskDTO = CreateNewTaskDTO.builder().title("").build();
        assertThrows(MissingDataException.class, () -> taskService.createTask(taskDTO));
    }

    @Test
    @DisplayName("Create new task with overextended length")
    void createTaskWithOverExtendedLength() {
        CreateNewTaskDTO taskDTO = CreateNewTaskDTO.builder().title("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl quis ultricies ultricies, nunc nisl ultricies nisl, quis ultricies nisl nisl quis nisl. Donec euismod, nisl quis ultricies ultricies, nunc nisl ultricies nisl, quis ultricies nisl nisl quis nisl.").build();
        assertThrows(OverExtendedLengthException.class, () -> taskService.createTask(taskDTO));
    }
}