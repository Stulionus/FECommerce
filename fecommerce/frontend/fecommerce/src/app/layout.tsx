// components/Layout.tsx
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/Logo.png';
import cart from '../../public/Shopping bag.png';
import './page.css'; // Make sure you have the relevant styles here

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
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
            <Image src={cart} alt="cart" className="navbar-cart" />
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
