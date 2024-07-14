import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ onProductAdded }) => {
  const [itemNumber, setItemNumber] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([{ size: '', quantity: '', sapNumber: '' }]);

  const handleSizeChange = (index, key, value) => {
    const newSizes = sizes.slice();
    newSizes[index][key] = value;
    setSizes(newSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { size: '', quantity: '', sapNumber: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/products', {
        itemNumber,
        name,
        description,
        price,
        sizes,
      });

      if (response.status === 201) {
        onProductAdded(response.data);
        setItemNumber('');
        setName('');
        setDescription('');
        setPrice('');
        setSizes([{ size: '', quantity: '', sapNumber: '' }]);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Item Number:</label>
        <input
          type="text"
          value={itemNumber}
          onChange={(e) => setItemNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Sizes:</label>
        {sizes.map((size, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Size"
              value={size.size}
              onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="SAP Number"
              value={size.sapNumber}
              onChange={(e) => handleSizeChange(index, 'sapNumber', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addSizeField}>Add Size</button>
      </div>
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProduct;