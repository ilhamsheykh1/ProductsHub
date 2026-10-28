import { Link } from "react-router-dom";

function Cart(props) {
  const total = props.cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const totalItems = props.cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  return (
    <section className="cart-page">
      <div className="cart-heading">
        <div>
          <h1>Shopping Cart</h1>
          <p>{totalItems} items in your cart</p>
        </div>

        <Link className="continue-shopping" to="/products">
          Continue Shopping
        </Link>
      </div>

      {props.cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products and they will appear here.</p>

          <Link className="add-button empty-cart-button" to="/products">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {props.cart.map((item) => {
              return (
                <article className="cart-item" key={item.id}>
                  <img
                    className="cart-item-image"
                    src={item.thumbnail}
                    alt={item.title}
                  />

                  <div className="cart-item-info">
                    <h3>{item.title}</h3>

                    <p className="cart-item-category">
                      {item.category}
                    </p>

                    <p className="cart-item-price">
                      ${item.price}
                    </p>

                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => {
                          props.decreaseQuantity(item.id);
                        }}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => {
                          props.increaseQuantity(item.id);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <strong>
                      ${(item.price * item.quantity)}
                    </strong>

                    <button
                      className="remove-item"
                      type="button"
                      onClick={() => {
                        props.removeFromCart(item.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>${total}</strong>
            </div>

            <button
              className="checkout-button"
              type="button"
              onClick={() => {
                alert("Checkout is not implemented yet.");
              }}
            >
              Proceed to Checkout
            </button>

            <button
              className="clear-cart-button"
              type="button"
              onClick={props.clearCart}
            >
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;