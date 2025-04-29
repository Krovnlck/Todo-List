import React from 'react';
import PropTypes from 'prop-types';
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
TodoFilter.defaultProps = {
  currentFilter: 'all'
};

TodoFilter.propTypes = {
  currentFilter: PropTypes.oneOf(['all', 'active', 'completed']), // Без isRequired
  setFilter: PropTypes.func.isRequired
};
