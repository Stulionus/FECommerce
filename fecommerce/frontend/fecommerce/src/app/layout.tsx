'use client';
import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/Logo.png';
import cartIcon from '../../public/Shopping bag.png';
import './page.css';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const cartItems = await response.json();
        const totalItems = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(totalItems);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, []);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-white">
          <header className="header">
            <div>
              <Link href="/">
                <Image src={logo} alt="logo" className="navbar-logo" />
              </Link>
            </div>
            <h1 className="navbar-text">Not Amazon</h1>
            <div className="cart">
              <Link href="/cart">
                <Image src={cartIcon} alt="cart" className="navbar-cart" />
                <div className="cart-count">{cartCount}</div>
              </Link>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
