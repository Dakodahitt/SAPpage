import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './Products';
import Cart from './Cart';
import AddProduct from './AddProduct';
import ProductDetail from './ProductDetail';

const App = () => {
  const [cart, setCart] = React.useState([]);
  const [creator, setCreator] = React.useState('');
  const [date, setDate] = React.useState('');
  const [patrol, setPatrol] = React.useState('');

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === product.size && item.sapNumber === product.sapNumber
    );

    if (existingProductIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, product]);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/cart" element={<Cart 
                                        cart={cart} 
                                        setCart={setCart} 
                                        creator={creator} 
                                        setCreator={setCreator} 
                                        date={date} 
                                        setDate={setDate} 
                                        patrol={patrol} 
                                        setPatrol={setPatrol} 
                                      />} />
        <Route path="/products" element={<Products addToCart={addToCart} />} />
        <Route path="/add-product" element={<AddProduct onProductAdded={(newProduct) => setCart([...cart, newProduct])} />} />
        <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/" element={<Products addToCart={addToCart} />} />
      </Routes>
    </Router>
  );
};

export default App;