import React from 'react';

export default function FilterBar({ filters, setFilters, onReset }) {
  return (
    <section className="filter-panel" aria-label="Event filters">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by event title, venue or keywords..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        {filters.search && (
          <button
            className="clear-btn"
            onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
          >
            &times;
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="catFilter">Category:</label>
          <select
            id="catFilter"
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="All">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Workshop">Workshop</option>
            <option value="Sports">Sports</option>
            <option value="Seminar">Seminar</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="statFilter">Status:</label>
          <select
            id="statFilter"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Fast Filling">Fast Filling</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortFilter">Sort By:</label>
          <select
            id="sortFilter"
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          >
            <option value="date-asc">Date (Earliest First)</option>
            <option value="date-desc">Date (Latest First)</option>
            <option value="seats-desc">Seats Available (High to Low)</option>
            <option value="seats-asc">Seats Available (Low to High)</option>
            <option value="title-asc">Title (A &rarr; Z)</option>
            <option value="title-desc">Title (Z &rarr; A)</option>
          </select>
        </div>

        <button className="btn btn-outline" onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  );
}
