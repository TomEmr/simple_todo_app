import React from 'react';
import { List } from '@mui/material';
import TodoItem from './TodoItem';

const TodoList = ({ todos, fetchTodos }) => {
  return (
    <List disablePadding>
      {todos.map((todo, index) => (
        <TodoItem key={todo.id || index} todo={todo} fetchTodos={fetchTodos} />
      ))}
    </List>
  );
};

export default TodoList;
