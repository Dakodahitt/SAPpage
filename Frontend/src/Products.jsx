import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://sappage.onrender.com/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    console.log(`Deleting product with ID: ${id}`);
    try {
      await axios.delete(`https://sappage.onrender.com/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === 'All' || product.category === category)
  );

  return (
    <>
      <Navbar />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Category1">Category1</option>
          <option value="Category2">Category2</option>
          <option value="Category3">Category3</option>
        </select>
        <button>Search</button>
      </div>
      <div className="products-container">
        {filteredProducts.map((product, index) => (
          <div key={index} className="product-item">
            <Link to={`/products/${product.id}`}>
              {product.image && <img src={product.image} alt={product.name} />}
            </Link>
            <h2>{product.name}</h2>
            <p>Starting at ${Math.min(...product.sizes.map(size => size.price)).toFixed(2)}</p>
            <div>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;