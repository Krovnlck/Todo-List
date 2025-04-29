import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { TodoForm } from './todo-form';
import { Todo } from './todo';
import { EditTodoForm } from './edit-todo-form';
import { TodoFilter } from './todo-filter';
import './todo-wrapper.css';

export const TodoWrapper = ({ initialTodos = [] }) => {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState('all');
  const hasCompletedTodos = todos.some((todo) => todo.completed);

  const addTodo = (todo) => {
    setTodos([
      ...todos,
      {
        id: uuidv4(),
        task: todo,
        completed: false,
        isEditing: false,
        createdAt: Date.now(),
      },
    ]);
  };

  const deleteCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };
  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = (task, id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className='TodoWrapper'>
      <h1>Get Things Done!</h1>
      <TodoForm addTodo={addTodo} />

      <div className='filter-container'>
        <TodoFilter currentFilter={filter} setFilter={setFilter} />
      </div>

      <div className='tasks-list-container'>
        {getFilteredTodos().map((todo) =>
          todo.isEditing ? (
            <EditTodoForm editTodo={editTask} task={todo} key={todo.id} />
          ) : (
            <Todo
              task={todo}
              key={todo.id}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              editTodoForm={editTodo}
            />
          )
        )}
      </div>

      <div className='footer-actions'>
        <span className='active-count'>
          {activeTodosCount} {activeTodosCount === 1 ? 'task' : 'tasks'} left
        </span>
        {hasCompletedTodos && (
          <button
            type='button'
            onClick={deleteCompletedTodos}
            className='clear-completed-btn'
          >
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
};

TodoWrapper.propTypes = {
  initialTodos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      task: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      isEditing: PropTypes.bool.isRequired,
      createdAt: PropTypes.instanceOf(Date),
    })
  ),
};

TodoWrapper.defaultProps = {
  initialTodos: [],
};

export default TodoWrapper;
