import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails(props) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://dummyjson.com/products/" + id
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        console.log(data.images);
        console.log(data.images.length);

        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        } else {
          setSelectedImage(data.thumbnail);
        }
      } catch (error) {
        console.log(error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  useEffect(() => {
    if (!modalOpen) return;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [modalOpen]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.thumbnail];

  return (
    <div className="container product-details">
      <Link to="/products" className="back-to-products">
        Back to Products
      </Link>

      <div className="product-gallery">
        <div className="gallery-thumbnails">
          {images.map((image, index) => {
            return (
              <button
                className={
                  selectedImage === image
                    ? "thumbnail active-thumbnail"
                    : "thumbnail"
                }
                type="button"
                key={index}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={product.title + " " + (index + 1)} />
              </button>
            );
          })}
        </div>

        <div className="main-image-container">
          <img
            className="main-product-image"
            src={selectedImage}
            alt={product.title}
            onClick={() => setModalOpen(true)}
          />

          <p className="image-hint">Click image to enlarge</p>
        </div>
      </div>

      <div className="details-info">
        <h1>{product.title}</h1>

        <p>Brand: {product.brand || "Not specified"}</p>

        <p>Category: {product.category}</p>

        <p className="details-price">
          Price: ${product.price}
        </p>

        <p>Rating: ★ {product.rating}</p>

        <p>Stock: {product.stock}</p>

        <p className="details-description">
          {product.description}
        </p>

        <button
          className="add-button"
          type="button"
          onClick={() => props.addToCart(product)}
        >
          Add to Cart
        </button>
      </div>

      <section className="reviews-section">
        <h2>Customer Reviews</h2>

        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review, index) => {
            return (
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
            );
          })
        ) : (
          <p>No reviews available.</p>
        )}
      </section>

      {modalOpen && (
        <div
          className="image-modal"
          onClick={() => setModalOpen(false)}
        >
          <button
            className="modal-close"
            type="button"
            onClick={() => setModalOpen(false)}
            aria-label="Close image"
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt={product.title}
            className="modal-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;