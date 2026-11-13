import React from 'react';

export default function FilterBar({
  searchKeyword,
  setSearchKeyword,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories
}) {
  return (
    <div className="controls-bar">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, description, or campus building..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>

      <div className="type-tabs">
        <button
          className={`tab-btn ${selectedType === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedType('ALL')}
        >
          All Items
        </button>
        <button
          className={`tab-btn ${selectedType === 'LOST' ? 'active' : ''}`}
          onClick={() => setSelectedType('LOST')}
        >
          Lost Only
        </button>
        <button
          className={`tab-btn ${selectedType === 'FOUND' ? 'active' : ''}`}
          onClick={() => setSelectedType('FOUND')}
        >
          Found Only
        </button>
      </div>

      <div className="filter-group">
        <select
          className="select-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="select-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="UNDER_VERIFICATION">Under Verification</option>
          <option value="CLAIMED">Claimed</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>
    </div>
  );
}
