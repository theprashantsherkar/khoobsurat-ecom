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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      const mapped = res.data.map((p) => ({ ...p, id: p._id }));
      setProducts(mapped);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Other actions wrapped similarly for loading and error...

  const addOrUpdateProduct = async (product) => {
    setLoading(true);
    setError(null);
    try {
      if (product.id) {
        await axios.put(`${API_URL}/${product.id}`, product);
      } else {
        await axios.post(API_URL, product);
      }
      await fetchProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
      setError("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

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
    <InventoryContext.Provider value={{ products, loading, error, actions }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
