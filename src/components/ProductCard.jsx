// src/components/ProductCard.jsx
import React from "react";

const DEFAULT_AVATAR = "/default-avatar.png";

export default function ProductCard({ product, onOpenView, onEdit, onDelete }) {
  // Calculate total pieces across all colors + sizes
  const totalPieces = Object.values(product.colors || {}).reduce((sum, sizes) => {
    return sum + Object.values(sizes).reduce((s, n) => s + Number(n || 0), 0);
  }, 0);

  return (
    <div
      onClick={() => onOpenView(product)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all p-4 flex flex-col items-center text-center cursor-pointer"
    >
      {/* Image */}
      <img
        src={product.image || DEFAULT_AVATAR}
        alt={product.name}
        className="w-40 h-40 object-cover rounded-md border-4 border-purple-200 mb-3"
      />

      {/* Name */}
      <h3 className="text-lg font-semibold">{product.name}</h3>

      {/* Total stock */}
      <p className="text-sm text-gray-600 mt-1">Total: {totalPieces} pcs</p>

      {/* Stock per color */}
      <div className="mt-2 w-full space-y-1">
        {Object.entries(product.colors || {}).map(([color, sizes]) => {
          const colorTotal = Object.values(sizes).reduce((s, n) => s + Number(n || 0), 0);
          return (
            <p
              key={color}
              className="text-xs flex justify-between bg-gray-50 px-2 py-1 rounded"
            >
              <span className="font-medium">{color}</span>
              <span>{colorTotal} pcs</span>
            </p>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            onEdit(product);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            onDelete(product.id);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
