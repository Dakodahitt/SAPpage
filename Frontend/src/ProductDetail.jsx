import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import './ProductDetail.css';

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

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

  const handleSizeChange = (event) => {
    const size = event.target.value;
    const sizeDetail = product.sizes.find((s) => s.size === size);
    setSelectedSize(size);
    setSelectedPrice(sizeDetail ? sizeDetail.price : 0);
  };

  const handleAddToCart = () => {
    const item = {
      id: product.id,
      name: product.name,
      size: selectedSize,
      sapNumber: product.sizes.find((s) => s.size === selectedSize).sapNumber,
      price: selectedPrice,
      quantity: 1,
    };
    addToCart(item);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="product-detail-container">
        <h1>{product.name}</h1>
        <img src={product.image} alt={product.name} />
        <p>{product.description}</p>
        <div>
          <label htmlFor="size">Select Size:</label>
          <select id="size" value={selectedSize} onChange={handleSizeChange}>
            <option value="">--Select Size--</option>
            {product.sizes.map((size) => (
              <option key={size.size} value={size.size}>
                {size.size} - ${size.price !== undefined ? size.price.toFixed(2) : 'N/A'}
              </option>
            ))}
          </select>
        </div>
        {selectedSize && (
          <p>
            Selected Size: {selectedSize} - ${selectedPrice.toFixed(2)}
          </p>
        )}
        <button onClick={handleAddToCart} disabled={!selectedSize}>
          Add to Cart
        </button>
      </div>
    </>
  );
};

export default ProductDetail;