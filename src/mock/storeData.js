export const vendors = [
  { id: 1, name: "Global Stationery Hub", contactPerson: "Rajesh Kumar", phone: "9876543210", address: "123 Market St, New Delhi", email: "info@globalstationery.com" },
  { id: 2, name: "Premium Uniforms Ltd", contactPerson: "Anita Singh", phone: "9876543211", address: "45 Industrial Area, Gurgaon", email: "sales@premiumuniforms.com" },
  { id: 3, name: "Book World Publishers", contactPerson: "Sameer Ahmed", phone: "9876543212", address: "78 Library Road, Noida", email: "contact@bookworld.in" }
];

export const categories = [
  { id: 1, name: "Uniforms", description: "School uniforms and accessories" },
  { id: 2, name: "Stationery", description: "Pens, notebooks, and office supplies" },
  { id: 3, name: "Books", description: "Textbooks and workbooks" }
];

export const subCategories = [
  { id: 1, category: "Uniforms", name: "Summer Uniform" },
  { id: 2, category: "Uniforms", name: "Winter Uniform" },
  { id: 3, category: "Stationery", name: "Writing Instruments" }
];

export const units = [
  { id: 1, name: "pcs", fullName: "Pieces" },
  { id: 2, name: "set", fullName: "Set" },
  { id: 3, name: "kg", fullName: "Kilograms" }
];

export const products = [
  { id: 1, name: "Cotton School Shirt", category: "Uniforms", subCategory: "Summer Uniform", unit: "pcs", purchasePrice: 250, salePrice: 450, stock: 120 },
  { id: 2, name: "Mathematics Textbook Vol 1", category: "Books", subCategory: "Textbooks", unit: "pcs", purchasePrice: 180, salePrice: 300, stock: 85 },
  { id: 3, name: "Gel Pen (Box of 10)", category: "Stationery", subCategory: "Writing Instruments", unit: "set", purchasePrice: 45, salePrice: 100, stock: 210 }
];

export const inventoryLogs = [
  { id: 1, date: "2024-04-18", type: "Sale", product: "Cotton School Shirt", quantity: 5, totalAmount: 2250, paymentMode: "Cash" },
  { id: 2, date: "2024-04-15", type: "Purchase", product: "Mathematics Textbook Vol 1", quantity: 50, totalAmount: 9000, paymentMode: "Bank Transfer" },
  { id: 3, date: "2024-04-12", type: "Sale", product: "Gel Pen (Box of 10)", quantity: 2, totalAmount: 200, paymentMode: "Online" }
];

export const storeStats = {
  totalStockValue: 1250000,
  monthlySales: 450000,
  lowStockItems: 12,
  vendorsCount: 15,
  salesTrend: [
    { month: "Jan", sales: 120000 },
    { month: "Feb", sales: 250000 },
    { month: "Mar", sales: 180000 },
    { month: "Apr", sales: 450000 }
  ],
  categoryDistribution: [
    { name: "Uniforms", value: 45 },
    { name: "Books", value: 35 },
    { name: "Stationery", value: 20 }
  ]
};
