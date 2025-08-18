import React, { useState, useEffect } from "react";

const DEFAULT_AVATAR = "/default-avatar.png";

export default function ProductDetailModal({
  product,
  onClose,
  onUpdateProduct,
  onDeleteProduct,
  onEditProduct,
}) {
  const [selectedColor, setSelectedColor] = useState("");
  const [localSizes, setLocalSizes] = useState([]); // [{size, qty}]
  const [dispatchMap, setDispatchMap] = useState({}); // { size: qtyToDispatch }
  const [error, setError] = useState("");
  const [lastDeleted, setLastDeleted] = useState(null); // store deleted entry for undo

  useEffect(() => {
    if (!product) return;
    const colors = Object.keys(product.colors || {});
    const firstColor = colors[0] || "";
    setSelectedColor(firstColor);
  }, [product]);

  useEffect(() => {
    if (!selectedColor) return;
    const sizesObj = product.colors[selectedColor] || {};
    const arr = Object.entries(sizesObj).map(([size, qty]) => ({ size, qty }));
    setLocalSizes(arr);
    setDispatchMap({});
    setError("");
  }, [selectedColor, product]);

  if (!product) return null;

  const setDispatchQty = (size, value) => {
    const v = Number(value || 0);
    setDispatchMap({ ...dispatchMap, [size]: v });
  };

  const doDispatch = () => {
    const entries = Object.entries(dispatchMap).filter(
      ([, v]) => Number(v) > 0
    );
    if (entries.length === 0)
      return setError("Enter quantity to dispatch for at least one size.");

    const updatedColors = { ...product.colors };
    const newHistoryEntries = [];

    for (const [size, qtyToDispatch] of entries) {
      const currentQty = Number(updatedColors[selectedColor][size] || 0);
      const dispatchQty = Number(qtyToDispatch);
      if (dispatchQty > currentQty) {
        return setError(
          `Cannot dispatch ${dispatchQty} from size ${size} — only ${currentQty} available.`
        );
      }
      updatedColors[selectedColor][size] = currentQty - dispatchQty;
      newHistoryEntries.push({
        id: Date.now() + Math.random(),
        type: "dispatch",
        color: selectedColor,
        size,
        qty: dispatchQty,
        remaining: updatedColors[selectedColor][size],
        timestamp: new Date().toISOString(),
      });
    }

    const updatedProduct = {
      ...product,
      colors: updatedColors,
      history: [...(product.history || []), ...newHistoryEntries],
      updatedAt: new Date().toISOString(),
    };

    onUpdateProduct(updatedProduct);
    setDispatchMap({});
    setLocalSizes(
      Object.entries(updatedColors[selectedColor]).map(([size, qty]) => ({
        size,
        qty,
      }))
    );
    setError("");
  };

  const handleDeleteHistoryEntry = (entryId) => {
    if (!window.confirm("Are you sure you want to delete this history entry?"))
      return;

    const updatedHistory = product.history.filter((h) => h.id !== entryId);
    const deletedEntry = product.history.find((h) => h.id === entryId);

    const updatedProduct = {
      ...product,
      history: updatedHistory,
    };

    onUpdateProduct(updatedProduct);
    setLastDeleted({ entry: deletedEntry, productId: product.id });
  };

  const handleUndoDelete = () => {
    if (!lastDeleted) return;
    const updatedProduct = {
      ...product,
      history: [...(product.history || []), lastDeleted.entry],
    };
    onUpdateProduct(updatedProduct);
    setLastDeleted(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-start pt-14 bg-purple-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={product.image || DEFAULT_AVATAR}
              alt={product.name}
              className="w-40 h-40 object-cover rounded-md border-4 border-purple-200 mb-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_AVATAR;
              }}
            />
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-sm text-gray-500">
                Total pieces:{" "}
                <strong>
                  {Object.values(product.colors || {})
                    .flatMap((obj) => Object.values(obj))
                    .reduce((a, b) => a + b, 0)}
                </strong>
              </p>
              <p className="text-xs text-gray-400">
                Added: {new Date(product.createdAt).toLocaleString()}
              </p>
              {product.updatedAt && (
                <p className="text-xs text-gray-400">
                  Updated: {new Date(product.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg shadow"
            >
              Close
            </button>
          </div>
        </div>
        {/* Colors Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          {Object.keys(product.colors || {}).map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`px-3 py-1 rounded ${
                selectedColor === color
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
        {/* Sizes table */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Size-wise Stock for {selectedColor}
          </h3>
          <div className="overflow-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Quantity</th>
                  <th className="px-3 py-2">Dispatch</th>
                </tr>
              </thead>
              <tbody>
                {localSizes.map((r) => (
                  <tr key={r.size} className="border-b">
                    <td className="px-3 py-2">{r.size}</td>
                    <td className="px-3 py-2">{r.qty}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        max={r.qty}
                        value={dispatchMap[r.size] ?? ""}
                        onChange={(e) => setDispatchQty(r.size, e.target.value)}
                        className="border p-1 rounded w-24"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={doDispatch}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Dispatch Selected
            </button>
          </div>
        </div>
        {/* History table */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Dispatch History</h3>
          {!product.history || product.history.length === 0 ? (
            <p className="text-gray-500">No history yet.</p>
          ) : (
            <div className="overflow-auto max-h-60">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left bg-gray-50">
                    <th className="px-3 py-2">Date & Time</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Color</th>
                    <th className="px-3 py-2">Size</th>
                    <th className="px-3 py-2">Qty</th>
                    <th className="px-3 py-2">Remaining</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...(product.history || [])]
                    .slice()
                    .reverse()
                    .map((h) => (
                      <tr key={h.id} className="border-b">
                        <td className="px-3 py-2 text-sm">
                          {new Date(h.timestamp).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-sm">{h.type}</td>
                        <td className="px-3 py-2 text-sm">{h.color}</td>
                        <td className="px-3 py-2 text-sm">{h.size}</td>
                        <td className="px-3 py-2 text-sm">{h.qty}</td>
                        <td className="px-3 py-2 text-sm">{h.remaining}</td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handleDeleteHistoryEntry(h.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Clear
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Undo Notification */}
        {lastDeleted && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded flex justify-between items-center">
            <span className="text-sm">
              History entry deleted.{" "}
              <button
                onClick={handleUndoDelete}
                className="text-blue-600 font-semibold hover:underline"
              >
                Undo
              </button>
            </span>
            <button
              onClick={() => setLastDeleted(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
