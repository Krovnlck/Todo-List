import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { TodoForm } from './todo-form';
import { Todo } from './todo';
import { EditTodoForm } from './edit-todo-form';
import { TodoFilter } from './todo-filter';
import './todo-wrapper.css';

export const TodoWrapper = ({ initialTodos = [] }) => {
	const [todos, setTodos] = useState(() => {
		const savedTodos = localStorage.getItem('todos');
		return savedTodos ? JSON.parse(savedTodos) : initialTodos;
	});
	const [filter, setFilter] = useState('all');
	const [runningTimers, setRunningTimers] = useState(() => {
		const savedTimers = localStorage.getItem('runningTimers');
		return savedTimers ? JSON.parse(savedTimers) : {};
	});
	const timerWorkerRef = useRef(null);
	const hasCompletedTodos = todos.some((todo) => todo.completed);

	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos));
	}, [todos]);

	useEffect(() => {
		localStorage.setItem('runningTimers', JSON.stringify(runningTimers));
	}, [runningTimers]);

	const updateTodoTimer = (id, elapsedTime) => {
		setTodos((prevTodos) => prevTodos.map((todo) => (
			todo.id === id
				? { ...todo, elapsedTime: Math.max(todo.elapsedTime, elapsedTime) }
				: todo
		)));
	};

	useEffect(() => {
		if (!timerWorkerRef.current) {
			const workerCode = `
				let timers = {};
				let lastTickTime = {};

				self.onmessage = function(e) {
					if (e.data.type === 'start') {
						const { id, elapsedTime } = e.data;
						const now = Date.now();
						
						timers[id] = {
							startTime: now,
							lastElapsedTime: elapsedTime,
							interval: setInterval(() => {
								const currentTime = Date.now();
								const timeSinceStart = currentTime - timers[id].startTime;
								const newElapsedTime = timers[id].lastElapsedTime + timeSinceStart;
								
								// Проверяем, что время только увеличивается
								if (!lastTickTime[id] || newElapsedTime > lastTickTime[id]) {
									lastTickTime[id] = newElapsedTime;
									self.postMessage({ 
										type: 'tick', 
										id, 
										elapsedTime: newElapsedTime 
									});
								}
							}, 1000)
						};
					} else if (e.data.type === 'stop') {
						const { id } = e.data;
						if (timers[id]) {
							const currentTime = Date.now();
							const finalElapsedTime = timers[id].lastElapsedTime + 
								(currentTime - timers[id].startTime);
							
							clearInterval(timers[id].interval);
							delete timers[id];
							delete lastTickTime[id];
							
							self.postMessage({ 
								type: 'final', 
								id, 
								elapsedTime: finalElapsedTime 
							});
						}
					}
				};
			`;

			const blob = new Blob([workerCode], { type: 'application/javascript' });
			timerWorkerRef.current = new Worker(URL.createObjectURL(blob));

			timerWorkerRef.current.onmessage = (e) => {
				if (e.data.type === 'tick' || e.data.type === 'final') {
					const { id, elapsedTime } = e.data;
					updateTodoTimer(id, elapsedTime);
				}
			};
		}

		// Восстанавливаем запущенные таймеры после перезагрузки
		Object.entries(runningTimers).forEach(([id, isRunning]) => {
			if (isRunning) {
				const todo = todos.find(t => t.id === id);
				if (todo) {
					timerWorkerRef.current.postMessage({
						type: 'start',
						id,
						elapsedTime: todo.elapsedTime
					});
				}
			}
		});

		return () => {
			if (timerWorkerRef.current) {
				timerWorkerRef.current.terminate();
				timerWorkerRef.current = null;
			}
		};
	}, []);

	const handleStartTimer = (id, elapsedTime) => {
		setRunningTimers(prev => ({ ...prev, [id]: true }));
		if (timerWorkerRef.current) {
			timerWorkerRef.current.postMessage({
				type: 'start',
				id,
				elapsedTime
			});
		}
	};

	const handleStopTimer = (id) => {
		setRunningTimers(prev => {
			const newTimers = { ...prev };
			delete newTimers[id];
			return newTimers;
		});
		if (timerWorkerRef.current) {
			timerWorkerRef.current.postMessage({
				type: 'stop',
				id
			});
		}
	};

	const addTodo = (todo) => {
		setTodos([
			...todos,
			{
				id: uuidv4(),
				task: todo,
				completed: false,
				isEditing: false,
				createdAt: Date.now(),
				elapsedTime: 0,
			},
		]);
	};

	const deleteCompletedTodos = () => {
		const completedIds = todos.filter(todo => todo.completed).map(todo => todo.id);
		completedIds.forEach(id => {
			if (runningTimers[id]) {
				handleStopTimer(id);
			}
		});
		setTodos(todos.filter((todo) => !todo.completed));
	};

	const deleteTodo = (id) => {
		if (runningTimers[id]) {
			handleStopTimer(id);
		}
		setTodos(todos.filter((todo) => todo.id !== id));
	};

	const toggleComplete = (id) => {
		setTodos(
			todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
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
						/>
					) : (
						<Todo
							task={todo}
							key={todo.id}
							toggleComplete={toggleComplete}
							deleteTodo={deleteTodo}
							editTodoForm={editTodo}
							isRunning={!!runningTimers[todo.id]}
							onStartTimer={() => handleStartTimer(todo.id, todo.elapsedTime)}
							onStopTimer={() => handleStopTimer(todo.id)}
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
				PropTypes.number
			]),
			elapsedTime: PropTypes.number,
		})
	),
};

TodoWrapper.defaultProps = {
	initialTodos: [],
};

export default TodoWrapper;
