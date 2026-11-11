function Filters(props) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search products..."
        value={props.search}
        onChange={(event) => props.onSearchChange(event.target.value)}
      />

      <div className="category-buttons">
        <button
          className={props.category === "" ? "active" : ""}
          onClick={() => props.onCategoryChange("")}
        >
          All
        </button>

        {props.categories.map((item) => (
          <button
            key={item.slug}
            className={props.category === item.slug ? "active" : ""}
            onClick={() => props.onCategoryChange(item.slug)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="price-filters">
        <input
          type="number"
          min="0"
          placeholder="Min price"
          value={props.minPrice}
          onChange={(event) => props.onMinPriceChange(event.target.value)}
        />

        <input
          type="number"
          min="0"
          placeholder="Max price"
          value={props.maxPrice}
          onChange={(event) => props.onMaxPriceChange(event.target.value)}
        />
      </div>

      <div className="rating-filter">
        <label>Minimum rating:</label>

        <select
          value={props.minRating}
          onChange={(event) => props.onRatingChange(event.target.value)}
        >
          <option value="">All ratings</option>
          <option value="1">1+ stars</option>
          <option value="2">2+ stars</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>

      <select
        value={props.sort}
        onChange={(event) => props.onSortChange(event.target.value)}
      >
        <option value="default">Default sorting</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
      </select>

      <button
        className="clear-filters-button"
        onClick={props.onClear}
      >
        Clear Filters
      </button>
    </div>
  );
}

export default Filters;