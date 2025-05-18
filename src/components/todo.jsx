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
	updateElapsedTime,
	isRunning,
	toggleTimer
}) => {
	const [time, setTime] = useState(task.elapsedTime || 0);

	useEffect(() => {
		let intervalId;
		if (isRunning) {
			intervalId = setInterval(() => {
				setTime(prevTime => {
					const newTime = prevTime + 1;
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

	const formatTime = (seconds) => {
		if (task.countdownSeconds !== null) {
			// Для обратного отсчета показываем оставшееся время
			const remainingSeconds = task.initialCountdown - seconds;
			if (remainingSeconds <= 0) return '00:00:00';
			const hours = Math.floor(remainingSeconds / 3600);
			const minutes = Math.floor((remainingSeconds % 3600) / 60);
			const secs = remainingSeconds % 60;

			return `${hours.toString().padStart(2, '0')}:${minutes
				.toString()
				.padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
		}

		// Для обычного таймера показываем прошедшее время
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const handleStartStop = () => {
		if (!task.completed) {
			toggleTimer(task.id);
		}
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
						{!task.completed && (
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
						)}
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
		elapsedTime: PropTypes.number,
		countdownSeconds: PropTypes.number,
		initialCountdown: PropTypes.number
	}).isRequired,
	toggleComplete: PropTypes.func.isRequired,
	deleteTodo: PropTypes.func.isRequired,
	editTodoForm: PropTypes.func.isRequired,
	updateElapsedTime: PropTypes.func.isRequired,
	isRunning: PropTypes.bool.isRequired,
	toggleTimer: PropTypes.func.isRequired
};

export default Todo;
