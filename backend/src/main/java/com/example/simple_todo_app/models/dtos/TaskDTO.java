package com.example.simple_todo_app.models.dtos;

import com.example.simple_todo_app.models.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDTO {

    private Long id;
    private String title;
    private Boolean completed;
    private int position;
    private LocalDateTime createdAt;

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.completed = task.isCompleted();
        this.position = task.getPosition();
        this.createdAt = task.getCreatedAt();
    }
}