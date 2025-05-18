import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './todo-form.css';

export const TodoForm = ({ addTodo }) => {
	const [value, setValue] = useState('');
	const [minutes, setMinutes] = useState('');
	const [seconds, setSeconds] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!value.trim()) return;

		const minutesInSeconds = minutes ? parseInt(minutes, 10) * 60 : 0;
		const secondsValue = seconds ? parseInt(seconds, 10) : 0;
		const totalSeconds = minutesInSeconds + secondsValue;

		addTodo(value, totalSeconds || null);
		setValue('');
		setMinutes('');
		setSeconds('');
	};

	const handleTimeInput = (e, setter) => {
		const { value: inputValue } = e.target;
		if (inputValue === '' || (/^\d+$/.test(inputValue) && parseInt(inputValue, 10) >= 0)) {
			setter(inputValue);
		}
	};

	return (
		<form className='TodoForm' onSubmit={handleSubmit}>
			<div className='input-group'>
				<input
					type='text'
					className='todo-input'
					value={value}
					placeholder='What is the task for today?'
					onChange={(e) => setValue(e.target.value)}
				/>
				<div className='timer-inputs'>
					<input
						type='text'
						className='time-input'
						value={minutes}
						placeholder='Min'
						onChange={(e) => handleTimeInput(e, setMinutes)}
						maxLength={3}
					/>
					<span>:</span>
					<input
						type='text'
						className='time-input'
						value={seconds}
						placeholder='Sec'
						onChange={(e) => handleTimeInput(e, setSeconds)}
						maxLength={2}
					/>
				</div>
			</div>
			<button type='submit' className='todo-form-btn'>
				Add task
			</button>
		</form>
	);
};

TodoForm.propTypes = {
	addTodo: PropTypes.func.isRequired,
};
