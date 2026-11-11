import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails(props) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(
          "https://dummyjson.com/products/" + id
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        console.log(error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="container product-details">
      <Link to="/products">Back to Products</Link>

      <img
        src={product.images[0]}
        alt={product.title}
        className="details-image"
      />

      <h1>{product.title}</h1>

      <p>Brand: {product.brand || "Not specified"}</p>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>
      <p>Rating: ★ {product.rating}</p>
      <p>Stock: {product.stock}</p>

      <p className="details-description">
        {product.description}
      </p>

      <button onClick={() => props.addToCart(product)}>
        Add to Cart
      </button>

      <section className="reviews-section">
        <h2>Customer Reviews</h2>

        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <h3>{review.reviewerName}</h3>

              <p className="review-rating">
                Rating: {"★".repeat(review.rating)}
              </p>

              <p>{review.comment}</p>

              <p>
                <strong>Email:</strong> {review.reviewerEmail}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </section>
    </div>
  );
}

export default ProductDetails;