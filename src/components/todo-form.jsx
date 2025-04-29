import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const TodoForm = ({ addTodo }) => {
  const [value, setValue] = useState('');

  
  const handleSubmit = (e) => {
    e.preventDefault();

    addTodo(value);

    setValue('');
  };
  return (
    <form className='TodoForm' onSubmit={handleSubmit}>
      <input
        type='text'
        className='todo-input'
        value={value}
        placeholder='what is the task for today?'
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="todo-form-btn">
        Add task
      </button>
    </form>
  );
};

TodoForm.propTypes = {
    addTodo: PropTypes.func.isRequired
  };
