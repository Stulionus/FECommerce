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
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-6">Your Shopping Cart</h2>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <p className="text-lg font-medium">Total Quantity: <span className="font-bold">{totalQuantity}</span></p>
        <p className="text-lg font-medium">Total Price: <span className="font-bold">${totalPrice.toFixed(2)}</span></p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="border-b border-gray-200 py-4 last:border-b-0">
              {item.product ? (
                <>
                  <h3 className="text-xl font-semibold mb-2">{item.product.name}</h3>
                  <p className="text-sm text-gray-700">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                  <p className="text-sm text-gray-700">Price: <span className="font-semibold">${item.product.price.toFixed(2)}</span></p>
                </>
              ) : (
                <p className="text-red-600">Product information is missing for this item.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartPage;
