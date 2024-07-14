import React from 'react';
import AddProduct from './AddProduct';

const AddProductPage = ({ onProductAdded }) => {
  return (
    <div>
      <h1>Add New Product</h1>
      <AddProduct onProductAdded={onProductAdded} />
    </div>
  );
};

export default AddProductPage;