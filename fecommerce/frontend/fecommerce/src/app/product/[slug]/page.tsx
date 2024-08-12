'use client';

import { useEffect, useState } from 'react';
import { Button, Card } from "@nextui-org/react";
import '../../page.css';
import photoPlaceholder from '../../../../public/product photo.jpg';
import React from 'react';
import Link from 'next/link';

const ProductPage = () => {
  const [product, setProduct] = useState<any>(null); // State to store the product details.
  const [similarProducts, setSimilarProducts] = useState<any[]>([]); // State to store a list of similar products.
  const [cart, setCart] = useState<{ [key: string]: number }>({}); // State to manage cart items with product IDs and quantities.

  useEffect(() => {
    const url = new URL(window.location.href); // Get the current URL.
    const id = url.pathname.split('/').pop(); // Extract product ID from URL.
    
    if (id) {
      // Fetch the details of the selected product.
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/product/${id}`);
          const data = await response.json();
          setProduct(data); // Update state with product details.
        } catch (error) {
          console.error('Error fetching product:', error); // Log errors related to fetching product data.
        }
      };

      // Fetch similar products excluding the current product.
      const fetchSimilarProducts = async () => {
        try {
          const response = await fetch('/api/products');
          const data = await response.json();
          const filteredProducts = data.items.filter((item: any) => item.id !== id);
          setSimilarProducts(filteredProducts); // Update state with similar products.
        } catch (error) {
          console.error('Error fetching similar products:', error); // Log errors related to fetching similar products.
        }
      };

      // Fetch cart data to update the cart state.
      const fetchCart = async () => {
        try {
          const response = await fetch('/api/cart');
          const data = await response.json();
          const cartItems = data.items.reduce((acc: { [key: string]: number }, item: any) => {
            acc[item.product.id] = item.quantity;
            return acc;
          }, {});
          setCart(cartItems); // Update state with cart items.
        } catch (error) {
          console.error('Error fetching cart:', error); // Log errors related to fetching cart data.
        }
      };

      fetchCart(); // Fetch cart data.
      fetchProduct(); // Fetch product details.
      fetchSimilarProducts(); // Fetch similar products.
    }
  }, []); // Empty dependency array ensures this effect runs once when the component mounts.

  // Function to add a product to the cart.
  const addToCart = async (productId: string) => {
    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }) // Send request to add product to cart.
      });
      setCart(prevCart => ({ ...prevCart, [productId]: (prevCart[productId] || 0) + 1 })); // Update cart state.
    } catch (error) {
      console.error('Error adding to cart:', error); // Log errors related to adding product to cart.
    }
  };

  // Function to remove a product from the cart.
  const removeFromCart = async (productId: string) => {
    try {
      await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }) // Send request to remove product from cart.
      });
      setCart(prevCart => {
        const newCart = { ...prevCart };
        if (newCart[productId] > 1) {
          newCart[productId] -= 1; // Decrease quantity if more than one.
        } else {
          delete newCart[productId]; // Remove product from cart if quantity is zero.
        }
        return newCart;
      });
    } catch (error) {
      console.error('Error removing from cart:', error); // Log errors related to removing product from cart.
    }
  };

  // Render loading message if product data is not yet available.
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-page"> {/* Container for the product page layout. */}
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className='this-product-image'>
          <img
            src={product.img || photoPlaceholder.src} // Display product image or placeholder.
            className="w-full h-full object-cover rounded-lg"
            alt={product.name}
          />
        </div>
        <div className="mt-4 md:mt-0 md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1> {/* Display product name. */}
          <p className="text-gray-700 mt-4">{product.description}</p>
          <div className="flex-grow"></div> {/* Display product description. */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span> {/* Display product price. */}
            {cart[product.id] ? (
              <div className="flex items-center">
                <button onClick={() => removeFromCart(product.id)} className="plus-minus-button bg-gray-200 rounded-xl px-2">-</button> {/* Decrement button for cart quantity. */}
                <span className="px-4">{cart[product.id]}</span> {/* Display current quantity in cart. */}
                <button onClick={() => addToCart(product.id)} className="plus-minus-button bg-gray-200 rounded-xl px-2">+</button> {/* Increment button for cart quantity. */}
              </div>
            ) : (
              <Button className="card-button bg-gray-200 rounded-md" size="sm" onClick={() => addToCart(product.id)}>Add to Cart</Button>
            )}
          </div>
        </div>
      </div>
      <div className="my-8 flex justify-center">
        <div className="border-t border-gray-300 w-[600px]"></div> {/* Divider line between product details and similar products. */}
      </div>
      <div className="similar-products mt-8">
        <h3 className="text-2xl font-bold mb-4">Similar Products</h3> {/* Section heading for similar products. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {similarProducts.map((similarProduct: any) => (
            <Card key={similarProduct.id} className="product-card flex flex-col justify-between font-inter"> {/* Card component for each similar product. */}
              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/product/${similarProduct.id}`}>
                  <img
                    src={similarProduct.img} // Display image of similar product.
                    className="product-image w-full object-cover rounded-lg"
                    alt={similarProduct.name}
                  />
                  <h4 className="text-lg font-bold mt-1 line-clamp-1">{similarProduct.name}</h4> {/* Display name of similar product. */}
                  
                  <p className="text-gray-500 line-clamp-4 text-sm">{similarProduct.description}</p> {/* Display description of similar product. */}
                  
                </Link>
                <div className="flex-grow"></div>
                <div className="flex items-center justify-between mt-0.5">
                  <div className="price truncate">
                    <span className="text-md font-bold mx-3.5 truncate">${similarProduct.price.toFixed(2)}</span> {/* Display price of similar product. */}
                  </div>
                  {cart[similarProduct.id] ? (
                    <div className="flex items-center">
                      <button onClick={() => removeFromCart(similarProduct.id)} className="plus-minus-button bg-gray-200 rounded-xl px-2">-</button> {/* Decrement button for similar product quantity in cart. */}
                      <span className="px-4">{cart[similarProduct.id]}</span> {/* Display current quantity of similar product in cart. */}
                      <button onClick={() => addToCart(similarProduct.id)} className="plus-minus-button bg-gray-200 rounded-xl px-2">+</button> {/* Increment button for similar product quantity in cart. */}
                    </div>
                  ) : (
                    <Button className="card-button bg-gray-200 rounded-md" size="sm" onClick={() => addToCart(similarProduct.id)}>Add to Cart</Button>
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
