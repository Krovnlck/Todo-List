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
	const [runningTimers, setRunningTimers] = useState(new Set());
	const hasCompletedTodos = todos.some((todo) => todo.completed);

	const updateElapsedTime = (id, elapsedTime) => {
		setTodos(prevTodos => prevTodos.map(todo => {
			if (todo.id === id) {
				if (todo.countdownSeconds !== null) {
					const remainingTime = todo.initialCountdown - elapsedTime;
					if (remainingTime <= 0) {
						return { ...todo, completed: true, elapsedTime: 0 };
					}
					return { ...todo, elapsedTime };
				}
				return { ...todo, elapsedTime };
			}
			return todo;
		}));
	};

	const addTodo = (todo, countdownSeconds) => {
		const newTodo = {
			id: uuidv4(),
			task: todo,
			completed: false,
			isEditing: false,
			createdAt: Date.now(),
			elapsedTime: 0,
			countdownSeconds,
			initialCountdown: countdownSeconds
		};
		setTodos([...todos, newTodo]);
	};

	const deleteCompletedTodos = () => {
		const completedIds = todos.filter(todo => todo.completed).map(todo => todo.id);
		setRunningTimers(prev => {
			const newTimers = new Set(prev);
			completedIds.forEach(id => newTimers.delete(id));
			return newTimers;
		});
		setTodos(todos.filter((todo) => !todo.completed));
	};

	const deleteTodo = (id) => {
		setRunningTimers(prev => {
			const newTimers = new Set(prev);
			newTimers.delete(id);
			return newTimers;
		});
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const toggleComplete = (id) => {
		setTodos(
			todos.map((todo) => {
				if (todo.id === id) {
					const completed = !todo.completed;
					if (completed) {
						setRunningTimers(prev => {
							const newTimers = new Set(prev);
							newTimers.delete(id);
							return newTimers;
						});
					}
					return { ...todo, completed };
				}
				return todo;
			})
		);
	};

	const editTodo = (id) => {
		setTodos(
			todos.map((todo) => (todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo))
		);
	};

	const editTask = (task, id) => {
		setTodos(
			todos.map((todo) => (todo.id === id ? { ...todo, task, isEditing: !todo.isEditing } : todo))
		);
	};

	const cancelEdit = (id) => {
		setTodos(
			todos.map((todo) => (todo.id === id ? { ...todo, isEditing: false } : todo))
		);
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

	const activeTodosCount = todos.filter((todo) => !todo.completed).length;

	const toggleTimer = (id) => {
		setRunningTimers(prev => {
			const newTimers = new Set(prev);
			if (newTimers.has(id)) {
				newTimers.delete(id);
			} else {
				newTimers.add(id);
			}
			return newTimers;
		});
	};

	return (
		<div className='TodoWrapper'>
			<h1>Get Things Done!</h1>
			<TodoForm addTodo={addTodo} />

			<div className='filter-container'>
				<TodoFilter currentFilter={filter} setFilter={setFilter} />
			</div>

			<div className='tasks-list-container'>
				{getFilteredTodos().map((todo) => (
					todo.isEditing ? (
						<EditTodoForm
							editTodo={editTask}
							task={todo}
							key={todo.id}
							onCancel={() => cancelEdit(todo.id)}
						/>
					) : (
						<Todo
							task={todo}
							key={todo.id}
							toggleComplete={toggleComplete}
							deleteTodo={deleteTodo}
							editTodoForm={editTodo}
							updateElapsedTime={updateElapsedTime}
							isRunning={runningTimers.has(todo.id)}
							toggleTimer={toggleTimer}
						/>
					)
				))}
			</div>

			<div className='footer-actions'>
				<span className='active-count'>
					{activeTodosCount}
					{' '}
					{activeTodosCount === 1 ? 'task' : 'tasks'}
					{' '}
					left
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
			createdAt: PropTypes.oneOfType([
				PropTypes.instanceOf(Date),
				PropTypes.number,
				PropTypes.string
			]),
			elapsedTime: PropTypes.number,
		})
	),
};

TodoWrapper.defaultProps = {
	initialTodos: [],
};

export default TodoWrapper;
