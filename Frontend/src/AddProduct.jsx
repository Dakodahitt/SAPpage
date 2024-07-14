import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sizes, setSizes] = useState([{ size: '', sapNumber: '' }]);
  const [image, setImage] = useState(null);

  const handleSizeChange = (index, key, value) => {
    const newSizes = sizes.slice();
    newSizes[index][key] = value;
    setSizes(newSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { size: '', sapNumber: '' }]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    sizes.forEach((size, index) => {
      formData.append(`sizes[${index}][size]`, size.size);
      formData.append(`sizes[${index}][sapNumber]`, size.sapNumber);
    });
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:3000/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        onProductAdded(response.data);
        setName('');
        setDescription('');
        setPrice('');
        setSizes([{ size: '', sapNumber: '' }]);
        setImage(null);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <label>Image:</label>
        <input
          type="file"
          onChange={handleImageChange}
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