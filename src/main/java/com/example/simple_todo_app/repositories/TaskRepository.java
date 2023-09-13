package com.example.simple_todo_app.repositories;

import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TaskRepository extends CrudRepository<Task, Long> {

    List<Task> findAllByUser(User user);

    List<Task> findAllByUserAndCompletedFalse(User user);

    List<Task> findAllByUserAndCompletedTrue(User user);

    void deleteAllByUserAndCompletedTrue(User user);

}
