import React from "react";
import { useInventory, STATUS } from "../context/InventoryContext";

export default function Sales() {
  const { products, loading, error, actions } = useInventory();

  // Filter products marked READY for sale
  const readyProducts = products.filter((p) => p.status === STATUS.READY);

  // Calculate total quantity across all colors and sizes
  const getTotalQty = (product) =>
    Object.values(product.colors || {}).reduce(
      (total, sizes) =>
        total + Object.values(sizes).reduce((sum, qty) => sum + Number(qty || 0), 0),
      0
    );

  const requestProduct = (id) => actions.requestProduct(id);

  if (loading) return <p className="text-center p-6">Loading products...</p>;
  if (error) return <p className="text-center p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sales - Products Ready for Request</h1>

      {readyProducts.length === 0 ? (
        <p>No products are currently ready for sale.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Product</th>
              <th className="border border-gray-300 p-2 text-center">Quantity</th>
              <th className="border border-gray-300 p-2">Last Updated</th>
              <th className="border border-gray-300 p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {readyProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2 text-center">{getTotalQty(product)}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(product.updatedAt).toLocaleString()}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => requestProduct(product.id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
