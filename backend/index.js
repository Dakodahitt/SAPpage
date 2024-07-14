const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const app = express();

// Ensure the public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('E-commerce Backend');
});

// Route to get all products
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { sizes: true },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { sizes: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to add a new product
app.post('/products', async (req, res) => {
  const { itemNumber, name, description, price, sizes } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        itemNumber,
        name,
        description,
        price: parseFloat(price),
        sizes: {
          create: sizes.map(size => ({
            size: size.size,
            sapNumber: size.sapNumber,
          })),
        },
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting product with ID: ${id}`);

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Route to export cart to PDF
app.post('/export-cart', async (req, res) => {
  const { cart, creator, date, patrol } = req.body;

  const doc = new PDFDocument();
  const fileName = `cart_${Date.now()}.pdf`;
  const filePath = path.join(__dirname, 'public', fileName);
  doc.pipe(fs.createWriteStream(filePath));

  // Add Title
  doc.fontSize(16).text('Store Room Order', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text('Use MM60 to find item # make sure you order it out of plan 1001', { align: 'center' });

  doc.moveDown(2);
  doc.fontSize(10).text(`Requestor's Name: ${creator}`, { align: 'left' });
  doc.text(`Date: ${date}`, { align: 'right' });

  doc.moveDown();
  doc.text(`Patrol: ${patrol}`, { align: 'left' });

  // Add Table Headers
  doc.moveDown(1);
  const headers = ['Item #', 'Description', 'Size', 'SAP #', 'Price', 'Quantity'];
  const positions = [50, 120, 250, 300, 380, 450]; // Adjust positions as necessary

  headers.forEach((header, index) => {
    doc.text(header, positions[index], doc.y, { align: 'left' });
  });

  doc.moveDown(0.5);

  // Draw a line below headers
  doc.moveTo(50, doc.y)
    .lineTo(580, doc.y)
    .stroke();

  // Add Table Rows
  cart.forEach((item, index) => {
    doc.moveDown(0.5);
    doc.text(item.itemNumber, positions[0], doc.y, { align: 'left' });
    doc.text(item.description, positions[1], doc.y, { align: 'left' });
    doc.text(item.size.size, positions[2], doc.y, { align: 'left' });
    doc.text(item.size.sapNumber, positions[3], doc.y, { align: 'left' });
    doc.text(item.price, positions[4], doc.y, { align: 'left' });
    doc.text(item.quantity, positions[5], doc.y, { align: 'left' });
  });

  // Finalize PDF file
  doc.end();

  // Send the PDF file path as the response
  res.json({ file: fileName });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});