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
  const products = await prisma.product.findMany();
  res.json(products);
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
            quantity: parseInt(size.quantity),
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
  const filePath = path.join(publicDir, fileName);
  doc.pipe(fs.createWriteStream(filePath));

  // Add Title
  doc.fontSize(16).text('Store Room Order', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text('Use MM60 to find item # make sure you order it out of plan 1001', { align: 'center' });

  doc.moveDown(2);
  doc.fontSize(10).text(`Requestors Name: ${creator}`, { align: 'left' });
  doc.text(`Date: ${date}`, { align: 'right' });

  doc.moveDown();
  doc.text(`Patrol: ${patrol}`, { align: 'left' });

  // Add Table Headers
  doc.moveDown(1);
  doc.fontSize(10).text('item #', 50, doc.y, { width: 80, align: 'left' });
  doc.text('Description', 130, doc.y, { width: 200, align: 'left' });
  doc.text('UNIT', 330, doc.y, { width: 50, align: 'left' });
  doc.text('PRICE', 380, doc.y, { width: 50, align: 'left' });
  doc.text('Quantity', 430, doc.y, { width: 50, align: 'left' });

  doc.moveDown(0.5);

  // Draw a line below headers
  doc.moveTo(50, doc.y)
    .lineTo(480, doc.y)
    .stroke();

  // Add Table Rows
  cart.forEach((item, index) => {
    doc.moveDown(0.5);
    doc.text(item.itemNumber, 50, doc.y, { width: 80, align: 'left' });
    doc.text(item.description, 130, doc.y, { width: 200, align: 'left' });
    doc.text(item.unit, 330, doc.y, { width: 50, align: 'left' });
    doc.text(item.price, 380, doc.y, { width: 50, align: 'left' });
    doc.text(item.quantity, 430, doc.y, { width: 50, align: 'left' });
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