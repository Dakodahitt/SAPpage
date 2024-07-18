const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const prisma = new PrismaClient();
const app = express();

// Ensure the public directory exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("E-commerce Backend");
});

// Route to get all products
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { sizes: true },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { sizes: true },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to add a new product
app.post("/products", async (req, res) => {
  const { name, description, imageUrl, sizes } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        image: imageUrl,
        sizes: {
          create: sizes.map((size) => ({
            size: size.size,
            sapNumber: size.sapNumber,
            price: parseFloat(size.price) || 0,
          })),
        },
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a product
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting product with ID: ${id}`);

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to export cart to PDF
app.post("/export-cart", async (req, res) => {
  const { cart, creator, date, patrol } = req.body;

  const doc = new PDFDocument({ margin: 50 });
  const fileName = `cart_${new Date().toISOString().slice(0, 10)}.pdf`;
  const filePath = path.join(__dirname, "public", fileName);
  doc.pipe(fs.createWriteStream(filePath));

  // Add Title
  doc.fontSize(16).text("Store Room Order", { align: "center" });
  doc.moveDown();

  doc.moveDown(2);
  doc
    .fontSize(10)
    .text(`Requestor's Name: ${creator}`, 50, doc.y, { align: "left" });
  doc.text(`Date: ${date}`, 450, doc.y, { align: "right" });

  doc.moveDown();
  doc.text(`Patrol: ${patrol}`, 50, doc.y, { align: "left" });

  // Add Table Headers
  doc.moveDown(1);

  const headers = [
    "SAP #",
    "Description",
    "Size",
    "Price",
    "Quantity",
  ];
  const positions = [50, 125, 250, 450, 520]; // Adjust positions as necessary

  let headerY = doc.y;

  headers.forEach((header, index) => {
    doc.text(header, positions[index], headerY, { align: "left" });
  });

  doc.moveDown(0.5);

  // Draw a line below headers
  const lineY = doc.y;
  doc.moveTo(50, lineY).lineTo(570, lineY).stroke();

  // Add Table Rows with fixed Y positioning
  const lineHeight = 20; // Adjust the line height as necessary

  let totalPrice = 0;

  cart.forEach((item, rowIndex) => {
    const y = lineY + lineHeight * (rowIndex + 1);
    doc.text(item.sapNumber, positions[0], y, { align: "left" });
    doc.text(item.name, positions[1], y, { align: "left" });
    doc.text(item.size, positions[2], y, { align: "left" });
    doc.text(item.price !== undefined ? item.price.toFixed(2) : 'N/A', positions[3], y, { align: "left" });
    doc.text(item.quantity, positions[4], y, { align: "left" });

    totalPrice += item.price * item.quantity;
  });

  // Add total price at the bottom
  doc.moveDown(2);
  doc.fontSize(12).text(`Total: $${totalPrice.toFixed(2)}`, { align: 'right' });

  // Finalize PDF file
  doc.end();

  // Send the PDF file path as the response
  res.json({ file: fileName });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});