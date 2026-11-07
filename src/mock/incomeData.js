export const incomeHeads = [
  { id: 1, name: "Donations", description: "Incomes received through donations" },
  { id: 2, name: "Book Sales", description: "Incomes from selling school books" },
  { id: 3, name: "Uniform Sales", description: "Incomes from selling school uniforms" },
  { id: 4, name: "Rent", description: "Incomes from renting school property" },
  { id: 5, name: "Sale of Assets", description: "Incomes from selling old assets" },
  { id: 6, name: "Interest", description: "Interest earned from bank deposits" },
];

export const incomeList = [
  {
    id: 1,
    name: "Book Sale - Grade 10",
    invoiceNo: "INC-2024-001",
    date: "2024-04-10",
    incomeHead: "Book Sales",
    amount: 15000,
    description: "Sale of grade 10 textbooks",
    document: "invoice_001.pdf"
  },
  {
    id: 2,
    name: "Old Furniture Sale",
    invoiceNo: "INC-2024-002",
    date: "2024-04-12",
    incomeHead: "Sale of Assets",
    amount: 5000,
    description: "Sold old staff room chairs",
    document: "receipt_002.jpg"
  },
  {
    id: 3,
    name: "Monthly Rent - Canteen",
    invoiceNo: "INC-2024-003",
    date: "2024-04-15",
    incomeHead: "Rent",
    amount: 12000,
    description: "Canteen rent for April",
    document: "rent_receipt_apr.pdf"
  },
  {
    id: 4,
    name: "Alumni Donation",
    invoiceNo: "INC-2024-004",
    date: "2024-04-18",
    incomeHead: "Donations",
    amount: 50000,
    description: "Donation for library expansion",
    document: "donation_cert.pdf"
  },
  {
    id: 5,
    name: "Interest Income",
    invoiceNo: "INC-2024-005",
    date: "2024-04-20",
    incomeHead: "Interest",
    amount: 2500,
    description: "Quarterly interest from savings account",
    document: ""
  }
];

export const incomeStats = {
  totalIncome: 84500,
  thisMonth: 84500,
  recentTransactionsCount: 5,
  topCategory: "Donations"
};

export const incomeTrendData = [
  { month: "Jan", amount: 45000 },
  { month: "Feb", amount: 52000 },
  { month: "Mar", amount: 48000 },
  { month: "Apr", amount: 84500 },
];

export const incomeCategoryData = [
  { name: "Donations", value: 50000 },
  { name: "Rent", value: 12000 },
  { name: "Sales", value: 20000 },
  { name: "Interest", value: 2500 },
];
