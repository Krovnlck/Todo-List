import React from "react";
import './todo-filter.css';

export const TodoFilter = ({ currentFilter, setFilter }) => {
  return (
    <div className="todo-filter">
      <button
        className={`filter-btn ${currentFilter === "all" ? "active" : ""}`}
        onClick={() => setFilter("all")}
      >
        All
      </button>
      <button
        className={`filter-btn ${currentFilter === "active" ? "active" : ""}`}
        onClick={() => setFilter("active")}
      >
        Active
      </button>
      <button
        className={`filter-btn ${currentFilter === "completed" ? "active" : ""}`}
        onClick={() => setFilter("completed")}
      >
        Completed
      </button>
    </div>
  );
};