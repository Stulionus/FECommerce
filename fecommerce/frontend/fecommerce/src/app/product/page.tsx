'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';;
import { Card, Button } from "@nextui-org/react";
import '../page.css';
import photoPLaceholder from '../../../public/product photo.jpg';
import React from 'react';

const ProductPage = () => {

  return (
      <div className="product-page">
        <Card className="product-card">
          <div className="p-4">
            <img
              src={photoPLaceholder.src}
              className="w-full h-40 object-cover rounded-lg"
              alt={"phot0"}
            />
            <h4 className="text-xl font-bold mt-4">Product</h4>
            <p className="text-gray-500 mt-2">
              Description
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xl font-bold">999</span>
              <Button size="sm">Add to Cart</Button>
            </div>
          </div>
        </Card>
      </div>
  );
};

export default ProductPage;
