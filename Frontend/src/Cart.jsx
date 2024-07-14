import React from 'react';
import axios from 'axios';

const Cart = ({ cart, setCart, creator, setCreator, date, setDate, patrol, setPatrol }) => {
  const exportCart = async () => {
    try {
      const response = await axios.post('http://localhost:3000/export-cart', { cart, creator, date, patrol });
      if (response.data.file) {
        window.location.href = `http://localhost:3000/${response.data.file}`;
      }
    } catch (error) {
      console.error('Error exporting cart:', error);
    }
  };

  const handleDelete = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <div>
        <label>
          Creator:
          <input type="text" value={creator} onChange={(e) => setCreator(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Patrol:
          <input type="text" value={patrol} onChange={(e) => setPatrol(e.target.value)} />
        </label>
      </div>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            Size: {item.size.size} - SAP: {item.size.sapNumber} - ${item.price} x {item.quantity}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={exportCart}>Export Cart to PDF</button>
    </div>
  );
};

export default Cart;