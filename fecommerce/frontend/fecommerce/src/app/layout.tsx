'use client';
import { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/Logo.png';
import cartIcon from '../../public/Shopping bag.png';
import './page.css';

type LayoutProps = {
  children: ReactNode; // Props type definition for the Layout component, which expects a ReactNode as its children.
};

const Layout = ({ children }: LayoutProps) => {
  const [cartCount, setCartCount] = useState<number>(0); // State to keep track of the number of items in the cart.

  useEffect(() => {
    // Effect to fetch cart data from the API when the component mounts.
    const fetchCartData = async () => {
      try {
        const response = await fetch('/api/cart'); // Fetch cart data from the API endpoint.
        if (!response.ok) {
          throw new Error('Network response was not ok'); // Handle network errors.
        }
        const cart = await response.json(); // Parse the JSON response.
        // Calculate the total number of items in the cart.
        const totalItems = cart.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
        setCartCount(totalItems); // Update state with the total number of items.
      } catch (error) {
        console.error('Error fetching cart data:', error); // Log any errors that occur during the fetch.
      }
    };

    fetchCartData(); // Call the function to fetch cart data.
  }, []); // Empty dependency array means this effect runs once when the component mounts.

  return (
    <html lang="en"> {/* Set the language attribute for the HTML document. */}
      <body>
        <div className="page-container"> {/* Container for the entire page layout. */}
          <header className="header"> {/* Header section containing the logo and cart information. */}
            <div>
              <Link href="/">
                <Image src={logo} alt="logo" className="navbar-logo" /> {/* Logo image with a link to the homepage. */}
              </Link>
            </div>
            <h1 className="navbar-text">Not Amazon</h1> {/* Page title or branding text. */}
            <div className="cart"> {/* Container for the cart icon and item count. */}
              <Link href="/cart">
                <Image src={cartIcon} alt="cart" className="navbar-cart" /> {/* Cart icon with a link to the cart page. */}
                <div className="cart-count">{cartCount}</div> {/* Display the number of items in the cart. */}
              </Link>
            </div>
          </header>
          <main>{children}</main> {/* Render the child components here. */}
        </div>
      </body>
    </html>
  );
};

export default Layout;
