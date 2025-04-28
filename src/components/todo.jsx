import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

export const Todo = ({ task, toggleComplete, deleteTodo, editTodoForm }) => (
  <div className='Todo'>
    <p
      onClick={() => toggleComplete(task.id)}
      className={`${task.completed ? 'completed' : ''}`}
    >
      {task.task}
    </p>
    <div>
      <button
      type='button'
        className='todo-btn'
        onClick={() => {
          editTodoForm(task.id);
        }}
      >
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
      <button
      type='button'
        className='todo-btn'
        onClick={() => {
          deleteTodo(task.id);
        }}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  </div>
);
