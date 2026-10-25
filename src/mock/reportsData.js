export const admissionReports = [
  { id: 1, admissionNo: "ADM-2024-001", studentName: "Aarav Sharma", class: "10", section: "A", gender: "Male", admissionDate: "2024-04-01", status: "Active" },
  { id: 2, admissionNo: "ADM-2024-002", studentName: "Ishani Verma", class: "9", section: "B", gender: "Female", admissionDate: "2024-04-02", status: "Active" },
  { id: 3, admissionNo: "ADM-2024-003", studentName: "Rohan Gupta", class: "11", section: "Sci", gender: "Male", admissionDate: "2024-04-05", status: "Active" }
];

export const transactionReports = [
  { id: 1, transactionId: "TRX-1001", date: "2024-04-10", type: "Income", amount: 25000, mode: "Bank Transfer", description: "Term 1 Fees Collection" },
  { id: 2, transactionId: "TRX-1002", date: "2024-04-12", type: "Expense", amount: 5000, mode: "Cash", description: "Library Book Purchases" },
  { id: 3, transactionId: "TRX-1003", date: "2024-04-15", type: "Income", amount: 12000, mode: "Online", description: "Transport Fees" }
];

export const feesReports = [
  { id: 1, receiptNo: "FEE-5001", studentName: "Aarav Sharma", class: "10", feeType: "Tuition Fee", paidAmount: 15000, date: "2024-04-05" },
  { id: 2, receiptNo: "FEE-5002", studentName: "Ishani Verma", class: "9", feeType: "Transport Fee", paidAmount: 2000, date: "2024-04-08" },
  { id: 3, receiptNo: "FEE-5003", studentName: "Rohan Gupta", class: "11", feeType: "Tuition Fee", paidAmount: 18000, date: "2024-04-10" }
];

export const payrollReports = [
  { id: 1, payslipId: "PAY-0424-01", staffName: "Mr. Ramesh Singh", role: "Teacher", monthYear: "April 2024", netSalary: 45000, status: "Paid" },
  { id: 2, payslipId: "PAY-0424-02", staffName: "Mrs. Sunita Devi", role: "Admin", monthYear: "April 2024", netSalary: 35000, status: "Paid" },
  { id: 3, payslipId: "PAY-0424-03", staffName: "Vinod Yadav", role: "Driver", monthYear: "April 2024", netSalary: 18000, status: "Pending" }
];

export const reportStats = {
  totalRevenue: 850000,
  totalExpenses: 210000,
  newAdmissions: 124,
  payrollDisbursed: 450000,
  financialFlow: [
    { month: "Jan", income: 500000, expense: 150000 },
    { month: "Feb", income: 600000, expense: 180000 },
    { month: "Mar", income: 450000, expense: 200000 },
    { month: "Apr", income: 850000, expense: 210000 }
  ],
  enrollmentTrend: [
    { month: "Jan", admissions: 45 },
    { month: "Feb", admissions: 60 },
    { month: "Mar", admissions: 85 },
    { month: "Apr", admissions: 124 }
  ]
};
