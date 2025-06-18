// components/CartDropdown.js
import { ShoppingCart, Trash2 } from 'lucide-react';

export default function CartDropdown({ cart, onRemove, onConfirm }) {
  return (
    <div className="cart-dropdown">
      <h3>Your Cart</h3>
      {cart.length === 0 ? (
        <p className="cart-empty">No books added.</p>
      ) : (
        cart.map((book) => (
          <div key={book._id} className="cart-item">
            <div className="cart-details">
              <strong>{book.title}</strong>
              <div className="cart-meta">{book.author}</div>
            </div>
            <button
              className="icon-button"
              onClick={() => onRemove(book._id)}
              aria-label="Remove from cart"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))
      )}
      {cart.length > 0 && (
        <button className="confirm-btn" onClick={onConfirm}>
          <ShoppingCart size={16} className="mr-2" />
          Confirm Rent
        </button>
      )}
    </div>
  );
}
