package com.example.simple_todo_app.repositories;

import com.example.simple_todo_app.models.Task;
import com.example.simple_todo_app.models.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends CrudRepository<Task, Long> {

    List<Task> findAllByUser(User user);

    List<Task> findAllByUserAndCompletedFalse(User user);

    List<Task> findAllByUserAndCompletedTrue(User user);

    void deleteAllByUserAndCompletedTrue(User user);

    List<Task> findByUserOrderByPositionAsc(User user);

    List<Task> findByUserAndCompletedOrderByPositionAsc(User user, boolean completed);

    @Query("SELECT COALESCE(MAX(t.position), 0) FROM Task t WHERE t.user = :user")
    int findMaxPositionByUser(@Param("user") User user);

}
