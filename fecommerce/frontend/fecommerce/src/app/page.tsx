'use client';

import { Card, Button } from "@nextui-org/react";
import "./page.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import React from "react";

const Home: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]); // State to store the list of products fetched from the API.
  const [cart, setCart] = useState<{ [key: string]: number }>({}); // State to store the cart with product IDs as keys and quantities as values.
  const [heroProduct, setHeroProduct] = useState<any>(null); // State to store the featured product (hero product).

  useEffect(() => {
    // Fetch products and cart data when the component mounts.
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Fetch product data from the API endpoint.
        const data = await response.json(); // Parse the JSON response.
        setProducts(data.items); // Update state with the list of products.

        // Set a random product as the hero product.
        if (data.items.length > 0) {
          const randomProduct = data.items[Math.floor(Math.random() * data.items.length)];
          setHeroProduct(randomProduct); // Update state with the randomly selected hero product.
        }
      } catch (error) {
        console.error('Error fetching products:', error); // Log any errors that occur during the fetch.
      }
    };

    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart'); // Fetch cart data from the API endpoint.
        const data = await response.json(); // Parse the JSON response.
        // Transform the cart items into a dictionary with product IDs as keys and quantities as values.
        const cartItems = data.items.reduce((acc: { [key: string]: number }, item: any) => {
          acc[item.product.id] = item.quantity;
          return acc;
        }, {});
        setCart(cartItems); // Update state with the cart items.
      } catch (error) {
        console.error('Error fetching cart:', error); // Log any errors that occur during the fetch.
      }
    };

    fetchProducts(); // Call function to fetch products.
    fetchCart(); // Call function to fetch cart data.
  }, []); // Empty dependency array means this effect runs once when the component mounts.

  const addToCart = async (productId: string) => {
    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }) // Send the product ID to the server to add it to the cart.
      });
      // Update state to reflect the addition of the product to the cart.
      setCart(prevCart => ({ ...prevCart, [productId]: (prevCart[productId] || 0) + 1 }));
    } catch (error) {
      console.error('Error adding to cart:', error); // Log any errors that occur during the fetch.
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }) // Send the product ID to the server to remove it from the cart.
      });
      // Update state to reflect the removal of the product from the cart.
      setCart(prevCart => {
        const newCart = { ...prevCart };
        if (newCart[productId] > 1) {
          newCart[productId] -= 1;
        } else {
          delete newCart[productId]; // Remove the product from the cart if the quantity is 0.
        }
        return newCart;
      });
    } catch (error) {
      console.error('Error removing from cart:', error); // Log any errors that occur during the fetch.
    }
  };

  return (
    <div className="product-page"> {/* Container for the product page layout. */}
      {heroProduct && (
        <div className="hero-image"> {/* Container for the hero product image. */}
          <img
            src={heroProduct.img} // Display the hero product image.
            alt="Hero"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Grid layout for displaying products. */}
        {products.map((product: any) => (
          <Card key={product.id} className="product-card flex flex-col justify-between font-inter"> {/* Card component for each product. */}
            <div className="p-4 flex flex-col flex-grow">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.img} // Display product image.
                  className="product-image w-full object-cover rounded-lg"
                  alt={product.name}
                />
                <h4 className="text-lg font-bold mt-1 line-clamp-1">{product.name}</h4> {/* Product name. */}
                
                <p className="text-gray-500 line-clamp-4 text-sm">{product.description}</p> {/* Product description. */}
                
              </Link>
              <div className="flex-grow"></div>
              <div className="flex items-center justify-between mt-0.5">
                <div className="price truncate">
                  <span className="text-md font-bold mx-3.5 truncate">${product.price.toFixed(2)}</span> {/* Product price. */}
                </div>
                {cart[product.id] ? (
                  <div className="flex items-center">
                    <button onClick={() => removeFromCart(product.id)} className="plus-minus-button bg-gray-200 rounded-xl px-2">-</button> {/* Decrement button for cart quantity. */}
                    <span className="px-4">{cart[product.id]}</span> {/* Display the current quantity of the product in the cart. */}
                    <button onClick={() => addToCart(product.id)} className="plus-minus-button bg-gray-200 rounded-xl px-2">+</button> {/* Increment button for cart quantity. */}
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
