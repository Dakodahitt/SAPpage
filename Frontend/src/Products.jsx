import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    console.log(`Deleting product with ID: ${id}`); // Log the ID
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h1>All Products</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.image && <img src={product.image} alt={product.name} width="100" />}
            {product.itemNumber} - {product.name} - ${product.price}
            <Link to={`/products/${product.id}`}>View Details</Link>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;