'use client';

import { Card, Button } from "@nextui-org/react";
import "./page.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [heroProduct, setHeroProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.items);

        // Set a random product as the hero product
        if (data.items.length > 0) {
          const randomProduct = data.items[Math.floor(Math.random() * data.items.length)];
          setHeroProduct(randomProduct);
        }
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
      {heroProduct && (
        <div className="hero-image">
          <img
            src={heroProduct.img}
            alt="Hero"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <Card key={product.id} className="product-card flex flex-col justify-between font-inter">
            <div className="p-4 flex flex-col flex-grow">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.img}
                  className="product-image w-full object-cover rounded-lg"
                  alt={product.name}
                />
                <h4 className="text-lg font-bold mt-1 line-clamp-1">{product.name}</h4>
                
                <p className="text-gray-500 line-clamp-4 text-sm">{product.description}</p>
                
              </Link>
              <div className="flex-grow"></div>
              <div className="flex items-center justify-between mt-0.5">
                <div className="price truncate">
                <span className="text-md font-bold mx-3.5 truncate">${product.price.toFixed(2)}</span>
                </div>
                {cart[product.id] ? (
                  <div className="flex items-center">
                    <button onClick={() => removeFromCart(product.id)} className="bg-gray-200 rounded-l px-2">-</button>
                    <span className="px-2">{cart[product.id]}</span>
                    <button onClick={() => addToCart(product.id)} className="bg-gray-200 rounded-r px-2">+</button>
                  </div>
                ) : (
                  <Button className="card-button bg-gray-200 rounded-md" size="sm" onClick={() => addToCart(product.id)}>Add to Cart</Button>
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
