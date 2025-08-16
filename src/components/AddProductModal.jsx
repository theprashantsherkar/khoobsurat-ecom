// src/components/AddProductModal.jsx
import React, { useState, useEffect } from "react";

const DEFAULT_AVATAR = "/default-avatar.png";

export default function AddProductModal({ initialProduct, onClose, onSave }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [colors, setColors] = useState({});
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState("");

  // ✅ always reset form when modal opens
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || "");
      setImage(initialProduct.image || "");
      setColors(initialProduct.colors || {});
      const firstColor = Object.keys(initialProduct.colors || {})[0] || "";
      setSelectedColor(firstColor);
    } else {
      setName("");
      setImage("");
      setColors({});
      setSelectedColor("");
    }
    setError("");
  }, [initialProduct, onClose]); // include onClose so fresh state on reopen

  // handle file -> base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const addColor = () => {
    const colorName = prompt("Enter color name:");
    if (!colorName) return;
    if (colors[colorName]) {
      alert("Color already exists");
      return;
    }
    setColors({ ...colors, [colorName]: {} });
    setSelectedColor(colorName);
  };

  const removeColor = (color) => {
    const newColors = { ...colors };
    delete newColors[color];
    setColors(newColors);
    setSelectedColor(Object.keys(newColors)[0] || "");
  };

  const addSizeRow = (color) => {
    setColors({
      ...colors,
      [color]: { ...colors[color], "": 0 },
    });
  };

  const removeSizeRow = (color, size) => {
    const newSizes = { ...colors[color] };
    delete newSizes[size];
    setColors({ ...colors, [color]: newSizes });
  };

  const updateSize = (color, size, newSize, qty) => {
    const newSizes = { ...colors[color] };
    delete newSizes[size];
    newSizes[newSize] = Number(qty || 0);
    setColors({ ...colors, [color]: newSizes });
  };

  const validateAndSave = () => {
    if (!name.trim()) return setError("Please enter product name.");
    if (Object.keys(colors).length === 0) return setError("Add at least one color.");
    for (const [color, sizeObj] of Object.entries(colors)) {
      if (!sizeObj || Object.keys(sizeObj).length === 0)
        return setError(`Add at least one size for color ${color}`);
      for (const [size, qty] of Object.entries(sizeObj)) {
        if (!size.trim()) return setError(`Size name cannot be empty for color ${color}`);
        if (qty < 0 || isNaN(qty)) return setError(`Quantity must be >=0 for color ${color}, size ${size}`);
      }
    }

    const product = {
      id: initialProduct?.id || Date.now(),
      name: name.trim(),
      image: image || "",
      colors,
      status: initialProduct?.status || "MANUFACTURED",
      history: initialProduct?.history || [],
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(product);
    onClose(); // ✅ close modal after saving
  };

  return (
    <div className="fixed inset-0 z-50 bg-purple-50 flex justify-center items-center p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
        <button
          className="absolute top-3 right-3 text-2xl font-bold text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">
          {initialProduct ? "Edit Product" : "Add Product"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left side */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded p-2"
            />
            <label className="block text-sm font-medium text-gray-700 mt-4 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
            />
            <div className="mt-4 flex justify-center">
              <img
                src={image || DEFAULT_AVATAR}
                alt="preview"
                className="w-36 h-36 object-cover rounded-lg border-4 border-purple-200"
              />
            </div>
          </div>

          {/* Right side */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors & Sizes
            </label>

            <div className="flex gap-2 flex-wrap mb-3">
              {Object.keys(colors).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 rounded ${
                    selectedColor === color
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {color}{" "}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      removeColor(color);
                    }}
                    className="ml-1 text-red-500 cursor-pointer"
                  >
                    ×
                  </span>
                </button>
              ))}
              <button
                onClick={addColor}
                className="px-3 py-1 rounded bg-green-500 text-white"
              >
                + Add Color
              </button>
            </div>

            {selectedColor && (
              <div>
                <h4 className="font-semibold mb-2">
                  Sizes for {selectedColor}
                </h4>
                <div className="space-y-2 max-h-60 overflow-auto pr-2">
                  {Object.entries(colors[selectedColor]).map(([size, qty]) => (
                    <div key={size} className="flex gap-2 items-center">
                      <input
                        value={size}
                        onChange={(e) =>
                          updateSize(selectedColor, size, e.target.value, qty)
                        }
                        placeholder="Size (e.g., M, L)"
                        className="border p-2 rounded w-2/3"
                      />
                      <input
                        value={qty}
                        onChange={(e) =>
                          updateSize(
                            selectedColor,
                            size,
                            size,
                            e.target.value
                          )
                        }
                        type="number"
                        min="0"
                        className="border p-2 rounded w-1/3"
                      />
                      <button
                        onClick={() => removeSizeRow(selectedColor, size)}
                        className="text-red-500 font-semibold ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addSizeRow(selectedColor)}
                  className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
                >
                  + Add Size
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={validateAndSave}
            className="px-4 py-2 rounded bg-purple-600 text-white"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
