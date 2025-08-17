// src/context/InventoryContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import sampleProducts from "../data/productsData";

const STORAGE_KEY = "manufacturing_products";

// status constants
export const STATUS = {
  PENDING: "PENDING",
  READY: "READY",
  REQUESTED: "REQUESTED",
  DISPATCHED: "DISPATCHED",
};

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return sampleProducts || [];
    } catch {
      return sampleProducts || [];
    }
  });

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  // actions
  const addOrUpdateProduct = (product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists
        ? prev.map((p) => (p.id === product.id ? { ...product } : p))
        : [...prev, product];
    });
  };

  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const markReady = (id) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: STATUS.READY } : p))
    );

  const requestProduct = (id) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: STATUS.REQUESTED } : p))
    );

  const dispatchProduct = (id) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: STATUS.DISPATCHED } : p))
    );

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
