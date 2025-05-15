import React, { useState, useEffect } from 'react';
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
	updateElapsedTime
}) => {
	const [isRunning, setIsRunning] = useState(false);
	const [time, setTime] = useState(task.elapsedTime || 0);

	useEffect(() => {
		let intervalId;
		if (isRunning) {
			intervalId = setInterval(() => {
				setTime(prevTime => {
					const newTime = prevTime + 1000;
					updateElapsedTime(task.id, newTime);
					return newTime;
				});
			}, 1000);
		}
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [isRunning, task.id, updateElapsedTime]);

	const formatTime = (ms) => {
		const seconds = Math.floor((ms / 1000) % 60);
		const minutes = Math.floor((ms / 1000 / 60) % 60);
		const hours = Math.floor(ms / 1000 / 60 / 60);

		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	const handleStartStop = () => {
		setIsRunning(prev => !prev);
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
							{formatTime(time)}
						</span>
						<button
							type='button'
							className={`timer-btn ${isRunning ? 'running' : ''}`}
							onClick={handleStartStop}
							onMouseDown={(e) => e.preventDefault()}
						>
							<FontAwesomeIcon
								icon={isRunning ? faCirclePause : faCirclePlay}
							/>
						</button>
					</div>
				</div>
				{task.createdAt && (
					<small className='created-at'>
						<FontAwesomeIcon icon={faClock} />
						{' '}
						{formatDistance(new Date(), task.createdAt, { addSuffix: true })}
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
		createdAt: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.number,
			PropTypes.string
		]),
		elapsedTime: PropTypes.number
	}).isRequired,
	toggleComplete: PropTypes.func.isRequired,
	deleteTodo: PropTypes.func.isRequired,
	editTodoForm: PropTypes.func.isRequired,
	updateElapsedTime: PropTypes.func.isRequired
};

export default Todo;
