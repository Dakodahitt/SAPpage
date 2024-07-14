import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Cart from './Cart';
import Products from './Products';
import AddProductPage from './AddProductPage';

const App = () => {
  const [cart, setCart] = useState([]);
  const [creator, setCreator] = useState('');
  const [date, setDate] = useState('');
  const [patrol, setPatrol] = useState('');

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleProductAdded = (newProduct) => {
    
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Cart</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/add-product">Add Product</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <Cart
                cart={cart}
                setCart={setCart}
                creator={creator}
                setCreator={setCreator}
                date={date}
                setDate={setDate}
                patrol={patrol}
                setPatrol={setPatrol}
              />
            }
          />
          <Route
            path="/products"
            element={<Products addToCart={addToCart} />}
          />
          <Route
            path="/add-product"
            element={<AddProductPage onProductAdded={handleProductAdded} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;