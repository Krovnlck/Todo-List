import React from 'react';
import './todo-filter.css';

export const TodoFilter = ({ currentFilter, setFilter }) => (
  <div className='todo-filter'>
    <button
      type='button'
      className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
      onClick={() => setFilter('all')}
    >
      All
    </button>
    <button
      type='button'
      className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
      onClick={() => setFilter('active')}
    >
      Active
    </button>
    <button
      type='button'
      className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
      onClick={() => setFilter('completed')}
    >
      Completed
    </button>
  </div>
);
