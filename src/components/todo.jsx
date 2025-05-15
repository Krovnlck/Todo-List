import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPenToSquare,
	faTrashAlt,
	faClock,
	faCirclePlay,
	faCirclePause,
} from '@fortawesome/free-regular-svg-icons';
import { formatDistance } from 'date-fns';
import './todo.css';

export const Todo = ({
	task,
	toggleComplete,
	deleteTodo,
	editTodoForm,
	isRunning,
	onStartTimer,
	onStopTimer
}) => {
	const [time, setTime] = useState(Date.now());

	useEffect(() => {
		const interval = setInterval(() => setTime(Date.now()), 5000);
		return () => clearInterval(interval);
	}, []);

	const formatTime = (ms) => {
		const seconds = Math.floor((ms / 1000) % 60);
		const minutes = Math.floor((ms / 1000 / 60) % 60);
		const hours = Math.floor(ms / 1000 / 60 / 60);

		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	return (
		<div className='Todo'>
			<div className='task-content'>
				<div className='task-main'>
					<p
						onClick={() => toggleComplete(task.id)}
						className={`${task.completed ? 'completed' : ''}`}
					>
						{task.task}
					</p>
					<div className='timer-container'>
						<span className='timer-display'>
							{formatTime(task.elapsedTime)}
						</span>
						<button
							type='button'
							className={`timer-btn ${isRunning ? 'running' : ''}`}
							onClick={isRunning ? onStopTimer : onStartTimer}
						>
							<FontAwesomeIcon icon={isRunning ? faCirclePause : faCirclePlay} />
						</button>
					</div>
				</div>
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
		elapsedTime: PropTypes.number,
	}).isRequired,
	toggleComplete: PropTypes.func.isRequired,
	deleteTodo: PropTypes.func.isRequired,
	editTodoForm: PropTypes.func.isRequired,
	isRunning: PropTypes.bool.isRequired,
	onStartTimer: PropTypes.func.isRequired,
	onStopTimer: PropTypes.func.isRequired,
};
