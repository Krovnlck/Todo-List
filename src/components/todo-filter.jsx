import React, { useState } from 'react';



export const TodoFilter = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    onFilterChange?.(filter); 
  };

  return (
    <div className="todo-filter">
      <button
        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
        onClick={() => handleFilterClick('all')}
      >
        All
      </button>
      <button
        className={`filter-btn ${activeFilter === 'active' ? 'active' : ''}`}
        onClick={() => handleFilterClick('active')}
      >
        Active
      </button>
      <button
        className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
        onClick={() => handleFilterClick('completed')}
      >
        Completed
      </button>
    </div>
  );
};
