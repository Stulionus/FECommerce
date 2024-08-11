'use client';
import { useEffect, useState } from 'react';
import './cart-page.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const items = await response.json();
        console.log('Fetched cart items:', items); // Inspect the structure
        setCartItems(items);

        // Calculate total quantity
        const total = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setTotalQuantity(total);
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
                  <p>Price: ${item.product.price}</p> {/* Assuming you have a price field */}
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
