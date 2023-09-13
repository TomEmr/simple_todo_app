package com.example.simple_todo_app.models.dtos;

import com.example.simple_todo_app.models.Task;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskDTO {

    private Long id;
    private String title;
    private Boolean completed;
    private Date createdAt;

    public TaskDTO(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.completed = task.getCompleted();
        this.createdAt = new Date();
    }
}