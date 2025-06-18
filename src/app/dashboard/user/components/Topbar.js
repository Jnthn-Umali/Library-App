// components/Topbar.js
import { ShoppingCart } from 'lucide-react';

export default function Topbar({ cartCount, onCartToggle }) {
  return (
    <div className="topbar">
      <button className="cart-icon-button" onClick={onCartToggle}>
        <ShoppingCart size={24} />
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </div>
  );
}
