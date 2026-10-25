// Admin Dashboard Mock Data
export const dashboardStats = {
  todayIncome: "₹45,200",
  monthIncome: "₹12,45,000",
  todayExpense: "₹12,800",
  monthExpense: "₹4,15,000",
  totalStudents: 1240,
  presentStudents: 1150,
  absentStudents: 90,
  totalStaff: 85,
  presentStaff: 82,
  absentStaff: 3,
};

export const monthlyFinanceData = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
  { name: "Jul", income: 3490, expense: 4300 },
];

export const paymentMethodsData = [
  { name: "Cash", value: 99.59, color: "#10b981" },
  { name: "UPI", value: 0.41, color: "#6366f1" },
  { name: "Card", value: 12.0, color: "#f59e0b" },
];

export const recentFeesData = [
  {
    id: 1,
    student: "Rahul Sharma",
    amount: 5000,
    status: "Paid",
    date: "2024-03-20",
  },
  {
    id: 2,
    student: "Sneha Kapur",
    amount: 3500,
    status: "Pending",
    date: "2024-03-19",
  },
  {
    id: 3,
    student: "Amit Verma",
    amount: 4200,
    status: "Paid",
    date: "2024-03-18",
  },
  {
    id: 4,
    student: "Priya Das",
    amount: 2800,
    status: "Paid",
    date: "2024-03-17",
  },
];

export const adminUpcomingEvents = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    date: "2024-04-15",
    time: "10:00 AM",
    type: "meeting",
  },
  {
    id: 2,
    title: "Annual Sports Day",
    date: "2024-04-20",
    time: "09:00 AM",
    type: "event",
  },
  {
    id: 3,
    title: "Board Exam Preparation",
    date: "2024-04-25",
    time: "02:00 PM",
    type: "academic",
  },
];

export const adminRecentActivity = [
  {
    id: 1,
    action: "New student admission",
    user: "Admin",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    action: "Fee collection completed",
    user: "Accountant",
    time: "4 hours ago",
    type: "success",
  },
  {
    id: 3,
    action: "Exam schedule updated",
    user: "Teacher",
    time: "6 hours ago",
    type: "info",
  },
  {
    id: 4,
    action: "New complaint registered",
    user: "Front Office",
    time: "8 hours ago",
    type: "warning",
  },
];
