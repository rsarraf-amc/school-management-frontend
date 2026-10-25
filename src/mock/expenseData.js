export const expenseHeads = [
  { id: 1, name: "Electricity Bill", description: "Monthly electricity charges" },
  { id: 2, name: "Staff Salary", description: "Salaries for non-teaching staff" },
  { id: 3, name: "Maintenance", description: "Building and equipment maintenance" },
  { id: 4, name: "Stationery", description: "Office and classroom supplies" },
  { id: 5, name: "Transportation", description: "Fuel and bus maintenance" },
  { id: 6, name: "Telephone/Internet", description: "Communication expenses" },
];

export const expenseList = [
  {
    id: 1,
    name: "April Electricity Bill",
    invoiceNo: "EXP-2024-001",
    date: "2024-04-05",
    expenseHead: "Electricity Bill",
    amount: 12500,
    description: "Main campus electricity bill",
    document: "bill_001.pdf"
  },
  {
    id: 2,
    name: "Printer Toner",
    invoiceNo: "EXP-2024-002",
    date: "2024-04-08",
    expenseHead: "Stationery",
    amount: 4500,
    description: "4 cartridges for office printer",
    document: "receipt_002.jpg"
  },
  {
    id: 3,
    name: "Bus Fuel - Week 1",
    invoiceNo: "EXP-2024-003",
    date: "2024-04-07",
    expenseHead: "Transportation",
    amount: 8000,
    description: "Fuel for 3 school buses",
    document: "fuel_receipt.pdf"
  },
  {
    id: 4,
    name: "Gardening Services",
    invoiceNo: "EXP-2024-004",
    date: "2024-04-12",
    expenseHead: "Maintenance",
    amount: 3000,
    description: "Monthly lawn and garden care",
    document: ""
  },
  {
    id: 5,
    name: "Internet Lease Line",
    invoiceNo: "EXP-2024-005",
    date: "2024-04-15",
    expenseHead: "Telephone/Internet",
    amount: 6000,
    description: "100Mbps lease line for campus",
    document: "telecom_bill.pdf"
  }
];

export const expenseStats = {
  totalExpense: 34000,
  thisMonth: 34000,
  recentTransactionsCount: 5,
  topCategory: "Electricity Bill"
};

export const expenseTrendData = [
  { month: "Jan", amount: 28000 },
  { month: "Feb", amount: 32000 },
  { month: "Mar", amount: 30000 },
  { month: "Apr", amount: 34000 },
];

export const expenseCategoryData = [
  { name: "Utilities", value: 18500 },
  { name: "Maintenance", value: 3000 },
  { name: "Supplies", value: 4500 },
  { name: "Logistics", value: 8000 },
];
