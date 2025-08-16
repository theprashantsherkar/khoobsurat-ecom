// src/pages/Manufacturing.jsx
import React, { useEffect, useState } from "react";
import AddProductModal from "../components/AddProductModal";
import ProductDetailModal from "../components/ProductDetailModal";
import ProductCard from "../components/ProductCard";   // <-- import new component
import sampleProducts from "../data/productsData";

const STORAGE_KEY = "manufacturing_products";

export default function Manufacturing() {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      return sampleProducts || [];
    } catch (e) {
      return sampleProducts || [];
    }
  });

  const [showAdd, setShowAdd] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleSaveProduct = (product) => {
    const exists = products.some((p) => p.id === product.id);
    if (exists) {
      setProducts(products.map((p) => (p.id === product.id ? { ...product } : p)));
    } else {
      setProducts([...products, product]);
    }
    setShowAdd(false);
    setEditProduct(null);
  };

  const handleOpenView = (product) => setViewProduct(product);
  const handleCloseView = () => setViewProduct(null);

  const handleUpdateProduct = (updated) => {
    setProducts(products.map((p) => (p.id === updated.id ? { ...updated } : p)));
    if (viewProduct && viewProduct.id === updated.id) setViewProduct(updated);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      if (viewProduct && viewProduct.id === id) setViewProduct(null);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setShowAdd(true);
  };

  const visible = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manufacturing
      </h1>

      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-3 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setEditProduct(null); setShowAdd(true); }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Product
            </button>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-center text-gray-500">
            No products yet. Add your first product.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenView={handleOpenView}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdd && (
        <AddProductModal
          initialProduct={editProduct}
          onClose={() => { setShowAdd(false); setEditProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}

      {viewProduct && (
        <ProductDetailModal
          product={viewProduct}
          onClose={handleCloseView}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onEditProduct={handleEditProduct}
        />
      )}
    </div>
  );
}
