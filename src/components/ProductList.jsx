import ProductCard from "./ProductCard";

function ProductList(props) {
  if (props.products.length === 0) {
    return (
      <p className="no-products">
        No products found. Try changing your search or filters.
      </p>
    );
  }

  return (
    <div className="products-grid">
      {props.products.map((product) => {
        return (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={props.addToCart}
          />
        );
      })}
    </div>
  );
}

export default ProductList;