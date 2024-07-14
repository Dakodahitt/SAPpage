import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <nav>
        <Link to="/cart">Cart</Link>
        <Link to="/products">Products</Link>
        <Link to="/add-product">Add Product</Link>
      </nav>
    </div>
  );
};

export default Navbar;