import React from 'react';
import { List } from '@mui/material';
import TodoItem from './TodoItem';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <List disablePadding>
      {todos.map((todo, index) => (
        <TodoItem key={todo.id || index} todo={todo} />
      ))}
    </List>
  );
};

export default TodoList;
