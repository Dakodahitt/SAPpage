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

  headers.forEach((header, index) => {
    doc.text(header, positions[index], doc.y, { align: "left" });
  });

  doc.moveDown(0.5);

  // Draw a line below headers
  const lineY = doc.y;
  doc.moveTo(50, lineY).lineTo(570, lineY).stroke();

  // Add Table Rows with fixed Y positioning
  const lineHeight = 20; // Adjust the line height as necessary
  let startY = doc.y;

  let totalPrice = 0;

  cart.forEach((item, rowIndex) => {
    const y = startY + lineHeight * (rowIndex + 1);
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