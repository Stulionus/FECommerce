'use client';

import { Card, Button } from "@nextui-org/react";
import "./page.css";
import productPlaceholder from "../../public/product photo.jpg";
import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({}); // {productId: quantity}

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.items);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        const data = await response.json();
        const cartItems = data.items.reduce((acc: { [key: string]: number }, item: any) => {
          acc[item.product.id] = item.quantity;
          return acc;
        }, {});
        setCart(cartItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchProducts();
    fetchCart();
  }, []);


  const addToCart = async (productId: string) => {
    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      setCart(prevCart => ({ ...prevCart, [productId]: (prevCart[productId] || 0) + 1 }));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      // Update local state after successful removal
      setCart(prevCart => {
        const newCart = { ...prevCart };
        if (newCart[productId] > 1) {
          newCart[productId] -= 1;
        } else {
          delete newCart[productId];
        }
        return newCart;
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  return (
    <div className="product-page">
      <div className="hero-image">
        <img
          src={productPlaceholder.src}
          alt="Hero"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <Card key={product.id} className="product-card">
            <div className="p-4">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.img}
                  width={160}
                  height={160}
                  className="w-full h-40 object-cover rounded-lg"
                  alt={product.name}
                />
                <h4 className="text-xl font-bold mt-4">{product.name}</h4>
                <p className="text-gray-500 mt-2">{product.description}</p>
              </Link>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                {cart[product.id] ? (
                  <div className="flex items-center">
                    <button onClick={() => removeFromCart(product.id)} className="bg-gray-200 rounded-l px-2">-</button>
                    <span className="px-2">{cart[product.id]}</span>
                    <button onClick={() => addToCart(product.id)} className="bg-gray-200 rounded-r px-2">+</button>
                  </div>
                ) : (
                  <Button size="sm" onClick={() => addToCart(product.id)}>Add to Cart</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
