import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import './AddProduct.css';

const AddProduct = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sizes, setSizes] = useState([{ size: '', sapNumber: '', price: '' }]);

  const handleAddSize = () => {
    setSizes([...sizes, { size: '', sapNumber: '', price: '' }]);
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
        imageUrl,
        sizes,
      };

      const response = await axios.post('https://sappage.onrender.com/products', newProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      onProductAdded(response.data);

      // Clear the form
      setName('');
      setDescription('');
      setImageUrl('');
      setSizes([{ size: '', sapNumber: '', price: '' }]);
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

          <label>Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />

<h3>Sizes</h3>
          {sizes.map((size, index) => (
            <div key={index} className="size-container">
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
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={size.price}
                onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
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
          </div>

          <h3>Styles</h3>
          {styles.map((style, index) => (
            <div key={index} className="style-container">
              <label>Style</label>
              <input
                type="text"
                value={style.style}
                onChange={(e) => handleStyleChange(index, 'style', e.target.value)}
                required
              />
              <label>SAP Number</label>
              <input
                type="text"
                value={style.sapNumber}
                onChange={(e) => handleStyleChange(index, 'sapNumber', e.target.value)}
                required
              />
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                value={style.price}
                onChange={(e) => handleStyleChange(index, 'price', e.target.value)}
                required
              />
              {styles.length > 1 && (
                <button type="button" onClick={() => handleRemoveStyle(index)}>
                  Remove Style
                </button>
              )}
            </div>
          ))}
          <div className="button-group">
            <button type="button" onClick={handleAddStyle}>
              Add Style
            </button>
            <button type="submit">Add Product</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;