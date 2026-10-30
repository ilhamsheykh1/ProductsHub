import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails(props) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("https://dummyjson.com/products/" + id);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        console.log(error);
        setError("Could not load product.");
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [id]);

  if (loading) {
    return <p className="status-message">Loading product...</p>;
  }

  if (error) {
    return <p className="status-message error-message">{error}</p>;
  }

  return (
    <section className="product-details-page">
      <Link to="/products" className="continue-shopping">
        ← Back to Products
      </Link>

      <div className="product-details-container">
        <div className="details-image">
          <img
            src={product.images[0]}
            alt={product.title}
          />
        </div>

        <div className="details-info">
          <span className="product-category">
            {product.brand || product.category}
          </span>

          <h1>{product.title}</h1>

          <p className="product-rating">
            ★ {product.rating}
          </p>

          <p className="details-description">
            {product.description}
          </p>

          <h2 className="product-price">
            ${product.price}
          </h2>

          <p>Stock: {product.stock}</p>

          <button
            className="add-button"
            type="button"
            onClick={() => {
              props.addToCart(product);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;