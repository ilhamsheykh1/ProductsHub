function ProductCard(props) {
  const product = props.product;

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} />
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.brand || product.category}
        </span>

        <h3>{product.title}</h3>

        <p className="product-rating">
          <span>★</span> {product.rating}
        </p>

        <p className="product-price">
          ${product.price}
        </p>

        <button
          className="add-button"
          onClick={() => {
            props.addToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;