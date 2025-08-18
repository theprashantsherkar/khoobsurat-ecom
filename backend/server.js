const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

// Increase JSON payload limit to handle large base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  colors: Object,   // { color: { size: qty } }
  status: String,
  history: Array,
  createdAt: String,
  updatedAt: String,
});
const Product = mongoose.model("Product", productSchema);

// Routes

// Get all products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Create product
app.post('/api/products', async (req, res) => {
  // Prevent clients from setting _id manually
  if (req.body._id) {
    delete req.body._id;
  }
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
