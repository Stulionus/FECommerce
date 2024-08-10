'use client';

import { Card, Button, Image } from "@nextui-org/react";
import "./page.css";
import logo from "../../public/Logo.png";
import cart from "../../public/Shopping bag.png";
import productPlaceholder from "../../public/product photo.jpg";
import { useState, useEffect } from "react";

const Home: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.items);  // Update state with fetched products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="header">
        <div>
          <img src={logo.src} alt="logo" className="navbar-logo" />
        </div>
        <h1 className="navbar-text">Not Amazon</h1>
        <div className="cart">
          <img src={cart.src} alt="cart" className="navbar-cart" />
        </div>
      </header>

      <main className="product-page">
        <div className="hero-image">
          <img
            src={productPlaceholder.src}
            alt="Hero"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <Card key={index} className="product-card">
              <div className="p-4">
                <img
                  src={product.img}
                  className="w-full h-40 object-cover rounded-lg"
                  alt={product.name}
                />
                <h4 className="text-xl font-bold mt-4">{product.name}</h4>
                <p className="text-gray-500 mt-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                  <div className="flex items-center">
                    <button className="bg-gray-200 rounded-l px-2">-</button>
                    <span className="px-2">5</span>
                    <button className="bg-gray-200 rounded-r px-2">+</button>
                  </div>
                  <Button size="sm">Add to Cart</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
