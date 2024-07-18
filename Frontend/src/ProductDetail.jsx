import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './ProductDetail.css';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://sappage.onrender.com/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (selectedSize) {
      const size = product.sizes.find(s => s.size === selectedSize);
      const itemToAdd = {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        size: size.size,
        sapNumber: size.sapNumber,
        price: size.price,
        quantity: 1,
      };
      addToCart(itemToAdd);
    } else {
      alert("Please select a size.");
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="product-detail-container">
        <img src={product.image} alt={product.name} />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>${product.price.toFixed(2)}</p>
        <div className="sizes-container">
          <label htmlFor="sizes">Select Size:</label>
          <select 
            id="sizes" 
            value={selectedSize} 
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Select a size</option>
            {product.sizes.map((size, index) => (
              <option key={index} value={size.size}>
                {size.size} (SAP: {size.sapNumber})
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </>
  );
};

export default ProductDetail;