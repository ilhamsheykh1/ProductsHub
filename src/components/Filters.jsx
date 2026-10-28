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
    </div>
  );
}

export default Filters;