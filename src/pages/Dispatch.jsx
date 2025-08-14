import { useInventory, STATUS } from "../context/InventoryContext.jsx";

export default function Dispatch() {
  const { products, actions } = useInventory();
  const requested = products.filter(p => p.status === STATUS.REQUESTED);
  const dispatched = products.filter(p => p.status === STATUS.DISPATCHED);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Pending Dispatch</h2>
        <List
          items={requested}
          empty="No items awaiting dispatch."
          actionsRenderer={item => (
            <button
              onClick={() => actions.markDispatched(item.id)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
            >
              Mark Dispatched
            </button>
          )}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Dispatched</h2>
        <List items={dispatched} empty="No dispatch history yet." />
      </section>
    </div>
  );
}

function List({ items, empty, actionsRenderer }) {
  if (!items.length) return <p className="text-sm text-gray-500">{empty}</p>;
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
