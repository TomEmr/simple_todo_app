package com.example.simple_todo_app.repositories;

import com.example.simple_todo_app.models.Task;
import org.springframework.data.repository.CrudRepository;

public interface TaskRepository extends CrudRepository<Task, Long> {

}
