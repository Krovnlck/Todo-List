import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPenToSquare,
	faTrashAlt,
	faClock,
} from '@fortawesome/free-regular-svg-icons';
import { formatDistance } from 'date-fns';

export const Todo = ({
	task, toggleComplete, deleteTodo, editTodoForm
}) => {
	const [time, setTime] = useState(Date.now());

	useEffect(() => {
		const interval = setInterval(() => setTime(Date.now()), 5000);
		return () => clearInterval(interval);
	}, []);

	return (
  <div className='Todo'>
    <div className='task-content'>
      <p
        onClick={() => toggleComplete(task.id)}
        className={`${task.completed ? 'completed' : ''}`}
      >
        {task.task}
      </p>
      {task.createdAt && (
      <small className='created-at'>
        <FontAwesomeIcon icon={faClock} />
        {' '}
        {formatDistance(time, task.createdAt)}
      </small>
				)}
    </div>
    <div className='task-actions'>
      <button
        type='button'
        className='todo-btn'
        onClick={() => editTodoForm(task.id)}
      >
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>
      <button
        type='button'
        className='todo-btn'
        onClick={() => deleteTodo(task.id)}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  </div>
	);
};

Todo.propTypes = {
	task: PropTypes.shape({
		id: PropTypes.string.isRequired,
		task: PropTypes.string.isRequired,
		completed: PropTypes.bool.isRequired,
		isEditing: PropTypes.bool.isRequired,
		createdAt: PropTypes.string,
	}).isRequired,
	timeInfo: PropTypes.shape({
		relative: PropTypes.string.isRequired,
		exact: PropTypes.string.isRequired,
	}).isRequired,
	toggleComplete: PropTypes.func.isRequired,
	deleteTodo: PropTypes.func.isRequired,
	editTodoForm: PropTypes.func.isRequired,
};
