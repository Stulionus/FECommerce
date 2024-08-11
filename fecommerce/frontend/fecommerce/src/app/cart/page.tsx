'use client';
import { useEffect, useState } from 'react';
import './cart-page.css';

type CartItem = {
  _id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const cart = await response.json();
        console.log('Fetched cart:', cart); // Inspect the structure

        const items = cart.items || [];
        setCartItems(items);

        // Calculate total quantity and total price
        const totalQty = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
        const total = items.reduce((acc: number, item: CartItem) => acc + (item.quantity * item.product.price), 0);

        setTotalQuantity(totalQty);
        setTotalPrice(total);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  return (
    <div className="cart-page">
      <h2>Your Shopping Cart</h2>
      <div className="cart-summary">
        <p>Total Quantity: {totalQuantity}</p>
        <p>Total Price: ${totalPrice.toFixed(2)}</p> {/* Format to two decimal places */}
      </div>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              {item.product ? (
                <>
                  <h3>{item.product.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.product.price.toFixed(2)}</p> {/* Format to two decimal places */}
                </>
              ) : (
                <p>Product information is missing for this item.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartPage;
