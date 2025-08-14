import { useState } from "react";
import { useInventory, STATUS } from "../context/InventoryContext.jsx";

export default function Manufacturing() {
  const { products, actions } = useInventory();
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  const manufactured = products.filter(p => p.status === STATUS.MANUFACTURED);
  const ready = products.filter(p => p.status === STATUS.READY);

  return (
    <div className="space-y-8">
      <section className="p-4 md:p-6 border rounded-2xl">
        <h2 className="text-lg font-semibold mb-4">Add Product (Manufacturing)</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            actions.addProduct({ name, qty, status: STATUS.MANUFACTURED });
            setName("");
            setQty("");
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Product name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Quantity"
            type="number"
            min="0"
            value={qty}
            onChange={e => setQty(e.target.value)}
            required
          />
          <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
            Add as Manufactured
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold">Manufactured (not yet ready)</h3>
        <List
          items={manufactured}
          empty="No manufactured items."
          actionsRenderer={item => (
            <button
              onClick={() => actions.markReady(item.id)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Mark Ready
            </button>
          )}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-semibold">Ready for Sales</h3>
        <List items={ready} empty="No ready items." />
      </section>
    </div>
  );
}

function List({ items, empty, actionsRenderer }) {
  if (!items.length) {
    return <p className="text-sm text-gray-500">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto border rounded-2xl">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th>Name</Th>
            <Th>Qty</Th>
            <Th>Status</Th>
            <Th>Updated</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t">
              <Td>{item.name}</Td>
              <Td>{item.qty}</Td>
              <Td>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100">
                  {item.status}
                </span>
              </Td>
              <Td>{new Date(item.updatedAt).toLocaleString()}</Td>
              <Td>{actionsRenderer ? actionsRenderer(item) : "-"}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const Th = ({ children }) => (
  <th className="text-left font-medium px-3 py-2">{children}</th>
);
const Td = ({ children }) => <td className="px-3 py-2">{children}</td>;
