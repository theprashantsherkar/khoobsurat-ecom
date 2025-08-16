// src/data/productsData.js
// Export an initial products array (optional). You can leave empty [] if you prefer
const sampleProducts = [
  {
    id: 1,
    name: "Floral Summer Dress",
    image: "", // will use placeholder if empty
    sizes: { S: 10, M: 20, L: 15, XL: 8 },
    history: [
      // example history entry format
      // { id: 1, type: "add"|"dispatch", size: "M", qty: 20, remaining: 20, timestamp: "2025-08-15T10:00:00Z" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Classic White Shirt",
    image: "",
    sizes: { M: 50, L: 40, XL: 30 },
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default sampleProducts;
