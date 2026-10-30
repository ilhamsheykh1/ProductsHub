import { Link } from "react-router-dom";

function ProductCard(props) {
  const product = props.product;

  return (
    <article className="product-card">
      <button
        type="button"
        className="wishlist-button"
        onClick={() => {
          props.toggleWishlist(product);
        }}
      >
        {props.isFavorite(product.id) ? "❤️" : "♡"}
      </button>

      <Link
        to={"/products/" + product.id}
        className="product-details-link"
      >
        <div className="product-image">
          <img
            src={product.thumbnail}
            alt={product.title}
          />
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
        </div>
      </Link>

      <button
        className="add-button"
        type="button"
        onClick={() => {
          props.addToCart(product);
        }}
      >
        Add to Cart
      </button>
    </article>
  );
}

export default ProductCard;