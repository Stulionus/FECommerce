'use client';
import { useEffect, useState } from 'react';
import { Card, Button } from "@nextui-org/react";
import '../../page.css';
import photoPlaceholder from '../../../../public/product photo.jpg';
import React from 'react';

const ProductPage = () => {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.pathname.split('/').pop();
    console.log(id);
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

      fetchProduct();
    }
  }, []);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-page">
      <Card className="product-card">
        <div className="p-4">
          <img
            src={product.img || photoPlaceholder.src} // Fallback to placeholder if no image
            className="w-full h-40 object-cover rounded-lg"
            alt={product.name}
          />
          <h4 className="text-xl font-bold mt-4">{product.name}</h4>
          <p className="text-gray-500 mt-2">{product.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
            <Button size="sm">Add to Cart</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;
