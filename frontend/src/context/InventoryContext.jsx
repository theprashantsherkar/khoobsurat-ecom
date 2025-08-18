import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const InventoryContext = createContext();

const API_URL = "http://localhost:4000/api/products";

export const STATUS = {
  PENDING: "PENDING",
  READY: "READY",
  REQUESTED: "REQUESTED",
  DISPATCHED: "DISPATCHED",
};

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products from backend, mapping _id to id for frontend consistency
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      const mapped = res.data.map((p) => ({ ...p, id: p._id }));
      setProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Add or update a product using MongoDB _id
  const addOrUpdateProduct = async (product) => {
    try {
      if (product.id) {
        // Update existing product
        await axios.put(`${API_URL}/${product.id}`, product);
      } else {
        // Create new product
        await axios.post(API_URL, product);
      }
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  // Delete product by id (_id)
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  // Update product status helper
  const updateProductStatus = async (id, status) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const updatedProduct = { ...product, status, updatedAt: new Date().toISOString() };
    await addOrUpdateProduct(updatedProduct);
  };

  const markReady = (id) => updateProductStatus(id, STATUS.READY);
  const requestProduct = (id) => updateProductStatus(id, STATUS.REQUESTED);
  const dispatchProduct = (id) => updateProductStatus(id, STATUS.DISPATCHED);

  const actions = {
    addOrUpdateProduct,
    deleteProduct,
    markReady,
    requestProduct,
    dispatchProduct,
  };

  return (
    <InventoryContext.Provider value={{ products, actions }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
