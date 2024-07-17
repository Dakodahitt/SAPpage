import React from 'react';
import axiosInstance from './axiosConfig'; // Updated import
import Navbar from './Navbar';
import './Cart.css';

const Cart = ({ cart, setCart, creator, setCreator, date, setDate, patrol, setPatrol }) => {
  const handleRemove = (index) => {
    const newCart = cart.slice();
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.post('/export-cart', {
        cart,
        creator,
        date,
        patrol,
      });
      const data = await response.json();
      window.open(`https://sappage.onrender.com/${data.file}`);
    } catch (error) {
      console.error('Error exporting cart:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h1>Cart</h1>
        <div className="cart-info">
          <div>
            <label>Requestor's Name:</label>
            <input
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label>Patrol:</label>
            <input
              type="text"
              value={patrol}
              onChange={(e) => setPatrol(e.target.value)}
            />
          </div>
        </div>
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <p>{item.name}</p>
              <p>Size: {item.size}</p>
              <p>SAP: {item.sapNumber}</p>
              <p>Quantity: {item.quantity}</p>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemove(index)}>Remove</button>
            </div>
          ))}
        </div>
        <button className="export-button" onClick={handleExport}>Export to PDF</button>
      </div>
    </>
  );
};

export default Cart;