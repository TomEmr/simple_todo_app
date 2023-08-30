package com.example.simple_todo_app.repositories;

import com.example.simple_todo_app.models.Task;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TaskRepository extends CrudRepository<Task, Long> {

    List<Task> findAll();

    List<Task> findAllByCompletedFalse();

    List<Task> findAllByCompletedTrue();

}
