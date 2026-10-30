function Filters(props) {
  return (
    <div className="filters">
      <input
        className="search-input"
        type="text"
        placeholder="Search products"
        value={props.search}
        onChange={(event) => {
          props.onSearchChange(event.target.value);
        }}
      />

      <div className="category-filters">
        <button
          type="button"
          className={
            props.category === ""
              ? "category-button selected"
              : "category-button"
          }
          onClick={() => {
            props.onCategoryChange("");
          }}
        >
          All
        </button>

        {props.categories.map((category) => {
          return (
            <button
              type="button"
              key={category.slug}
              className={
                props.category === category.slug
                  ? "category-button selected"
                  : "category-button"
              }
              onClick={() => {
                props.onCategoryChange(category.slug);
              }}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="price-filters">
        <input
          type="number"
          min="0"
          className="price-input"
          placeholder="Min Price"
          value={props.minPrice}
          onChange={(event) => {
            props.onMinPriceChange(event.target.value);
          }}
        />

        <input
          type="number"
          min="0"
          className="price-input"
          placeholder="Max Price"
          value={props.maxPrice}
          onChange={(event) => {
            props.onMaxPriceChange(event.target.value);
          }}
        />
      </div>

      <select
        className="sort-select"
        value={props.sort}
        onChange={(event) => {
          props.onSortChange(event.target.value);
        }}
      >
        <option value="default">Default sorting</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
      </select>

      <button
        type="button"
        className="clear-filters-button"
        onClick={props.onClear}
      >
        Clear Filters
      </button>
    </div>
  );
}

export default Filters;