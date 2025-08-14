import { createContext, useContext, useMemo, useState } from "react";

const InventoryContext = createContext(null);
export const useInventory = () => useContext(InventoryContext);

export const STATUS = {
  MANUFACTURED: "MANUFACTURED",
  READY: "READY",
  REQUESTED: "REQUESTED",
  DISPATCHED: "DISPATCHED",
};

const initialProducts = [
  { id: "p-1", name: "Widget A", qty: 50, status: STATUS.READY, updatedAt: Date.now() },
  { id: "p-2", name: "Widget B", qty: 20, status: STATUS.MANUFACTURED, updatedAt: Date.now() },
  { id: "p-3", name: "Widget C", qty: 15, status: STATUS.REQUESTED, updatedAt: Date.now() },
];

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = ({ name, qty, status = STATUS.MANUFACTURED }) => {
    const id = `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setProducts(prev => [
      { id, name, qty: Number(qty) || 0, status, updatedAt: Date.now() },
      ...prev,
    ]);
  };

  const updateStatus = (id, status) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, status, updatedAt: Date.now() } : p))
    );
  };

  const actions = useMemo(
    () => ({
      addProduct,
      markReady: id => updateStatus(id, STATUS.READY),
      requestItem: id => updateStatus(id, STATUS.REQUESTED),
      markDispatched: id => updateStatus(id, STATUS.DISPATCHED),
      setManufactured: id => updateStatus(id, STATUS.MANUFACTURED),
    }),
    []
  );

  return (
    <InventoryContext.Provider value={{ products, actions, STATUS }}>
      {children}
    </InventoryContext.Provider>
  );
}
