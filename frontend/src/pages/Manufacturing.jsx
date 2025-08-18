import React, { useState } from "react";
import { useInventory } from "../context/InventoryContext";
import AddProductModal from "../components/AddProductModal";
import ProductDetailModal from "../components/ProductDetailModal";
import ProductCard from "../components/ProductCard";

export default function Manufacturing() {
  const { products, actions } = useInventory();
  const [showAdd, setShowAdd] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [query, setQuery] = useState("");

  const visible = products.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleSaveProduct = async (product) => {
    await actions.addOrUpdateProduct(product);
    setShowAdd(false);
    setEditProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await actions.deleteProduct(id);
      if (viewProduct && viewProduct.id === id) setViewProduct(null);
    }
  };

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
              onClick={() => {
                setEditProduct(null);
                setShowAdd(true);
              }}
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
                onOpenView={setViewProduct}
                onEdit={(product) => {
                  setEditProduct(product);
                  setShowAdd(true);
                }}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <AddProductModal
          initialProduct={editProduct}
          onClose={() => {
            setShowAdd(false);
            setEditProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

      {viewProduct && (
        <ProductDetailModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          onUpdateProduct={actions.addOrUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onEditProduct={(product) => {
            setEditProduct(product);
            setShowAdd(true);
          }}
        />
      )}
    </div>
  );
}
