import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export const EditTodoForm = ({ editTodo, task, onCancel }) => {
	const [value, setValue] = useState(task.task);
	const formRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (formRef.current && !formRef.current.contains(event.target)) {
				onCancel();
			}
		};

		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				onCancel();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	}, [onCancel]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (value.trim()) {
			editTodo(value, task.id);
		} else {
			onCancel();
		}
	};

	return (
		<form className='TodoForm' onSubmit={handleSubmit} ref={formRef}>
			<input
				type='text'
				className='todo-input'
				value={value}
				placeholder='Update Task'
				onChange={(e) => setValue(e.target.value)}
				ref={inputRef}
			/>
			<button type='submit' className='todo-btn'>
				Update Task
			</button>
		</form>
	);
};

EditTodoForm.propTypes = {
	editTodo: PropTypes.func.isRequired,
	task: PropTypes.shape({
		id: PropTypes.string.isRequired,
		task: PropTypes.string.isRequired
	}).isRequired,
	onCancel: PropTypes.func.isRequired
};
