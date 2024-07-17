import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './AddProduct.css';

const AddProduct = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sizes, setSizes] = useState([{ size: '', sapNumber: '' }]);

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', sapNumber: '' }]);
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleRemoveSize = (index) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    setSizes(newSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newProduct = {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        sizes,
      };

      const response = await axios.post('http://localhost:3000/products', newProduct);
      onProductAdded(response.data);

      // Clear the form
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setSizes([{ size: '', sapNumber: '' }]);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-product-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

          <h3>Sizes</h3>
          {sizes.map((size, index) => (
            <div key={index}>
              <label>Size</label>
              <input
                type="text"
                value={size.size}
                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                required
              />
              <label>SAP Number</label>
              <input
                type="text"
                value={size.sapNumber}
                onChange={(e) => handleSizeChange(index, 'sapNumber', e.target.value)}
                required
              />
              {sizes.length > 1 && (
                <button type="button" onClick={() => handleRemoveSize(index)}>
                  Remove Size
                </button>
              )}
            </div>
          ))}
          <div className="button-group">
            <button type="button" onClick={handleAddSize}>
              Add Size
            </button>

            <button type="submit">Add Product</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;