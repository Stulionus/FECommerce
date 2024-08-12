'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from "@nextui-org/react";
import '../../page.css';
import photoPlaceholder from '../../../../public/product photo.jpg';
import React from 'react';
import Link from 'next/link';

const ProductPage = () => {
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({}); // {productId: quantity}

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.pathname.split('/').pop();
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/product/${id}`);
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      const fetchSimilarProducts = async () => {
        try {
          const response = await fetch('/api/products');
          const data = await response.json();
          const filteredProducts = data.items.filter((item: any) => item.id !== id);
          setSimilarProducts(filteredProducts);
        } catch (error) {
          console.error('Error fetching similar products:', error);
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

      fetchCart();
      fetchProduct();
      fetchSimilarProducts();
    }
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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-page p-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <img
          src={product.img || photoPlaceholder.src} // Fallback to placeholder if no image
          className="w-full md:w-1/2 h-auto object-cover rounded-lg"
          alt={product.name}
        />
        <div className="mt-4 md:mt-0 md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700 mt-4">{product.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            <Button size="sm" onClick={() => addToCart(product.id)}>Add to Cart</Button>
          </div>
        </div>
      </div>

      <div className="similar-products mt-8">
        <h3 className="text-2xl font-bold mb-4">Similar Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {similarProducts.map((similarProduct: any) => (
            <Card key={similarProduct.id} className="product-card flex flex-col justify-between">
              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/product/${similarProduct.id}`}>
                  <img
                    src={similarProduct.img || photoPlaceholder.src}
                    className="w-full h-40 object-cover rounded-lg"
                    alt={similarProduct.name}
                  />
                  <h4 className="text-xl font-bold mt-4 line-clamp-1">{similarProduct.name}</h4>
                  <p className="text-gray-500 mt-2 line-clamp-4">{similarProduct.description}</p>
                </Link>
                <div className="flex-grow"></div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold">${similarProduct.price.toFixed(2)}</span>
                  {cart[similarProduct.id] ? (
                    <div className="flex items-center">
                      <button onClick={() => removeFromCart(similarProduct.id)} className="bg-gray-200 rounded-l px-2">-</button>
                      <span className="px-2">{cart[similarProduct.id]}</span>
                      <button onClick={() => addToCart(similarProduct.id)} className="bg-gray-200 rounded-r px-2">+</button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => addToCart(similarProduct.id)}>Add to Cart</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
