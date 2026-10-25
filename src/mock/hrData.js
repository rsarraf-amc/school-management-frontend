export const departments = [
  { id: 1, name: "Academic" },
  { id: 2, name: "Admin" },
  { id: 3, name: "Finance" },
  { id: 4, name: "Library" },
  { id: 5, name: "Sports" }
];

export const designations = [
  { id: 1, name: "Teacher" },
  { id: 2, name: "Principal" },
  { id: 3, name: "Accountant" },
  { id: 4, name: "Librarian" },
  { id: 5, name: "Clerk" }
];

export const shifts = [
  { id: 1, name: "Morning Shift", timeFrom: "08:00 AM", timeTo: "02:00 PM" },
  { id: 2, name: "Evening Shift", timeFrom: "02:00 PM", timeTo: "08:00 PM" },
  { id: 3, name: "General Shift", timeFrom: "09:00 AM", timeTo: "05:00 PM" }
];

export const leaveTypes = [
  { id: 1, name: "Casual Leave" },
  { id: 2, name: "Medical Leave" },
  { id: 3, name: "Maternity Leave" },
  { id: 4, name: "Earned Leave" }
];

export const staffList = [
  {
    id: 1,
    staffId: "STF-001",
    name: "Rajesh Kumar",
    role: "Teacher",
    department: "Academic",
    designation: "Teacher",
    phone: "+91 9876543210",
    email: "rajesh.k@example.com",
    status: "Active",
    joiningDate: "2020-04-01"
  },
  {
    id: 2,
    staffId: "STF-002",
    name: "Sneha Sharma",
    role: "Admin",
    department: "Admin",
    designation: "Principal",
    phone: "+91 9876543211",
    email: "sneha.s@example.com",
    status: "Active",
    joiningDate: "2015-06-15"
  },
  {
    id: 3,
    staffId: "STF-003",
    name: "Amit Patel",
    role: "Accountant",
    department: "Finance",
    designation: "Accountant",
    phone: "+91 9876543212",
    email: "amit.p@example.com",
    status: "Active",
    joiningDate: "2018-08-20"
  }
];

export const leaveRequests = [
  { id: 1, staff: "Rajesh Kumar", type: "Medical Leave", date: "2024-04-20 to 2024-04-22", days: 3, applyDate: "2024-04-18", status: "Pending" },
  { id: 2, staff: "Amit Patel", type: "Casual Leave", date: "2024-04-25", days: 1, applyDate: "2024-04-21", status: "Approved" }
];

export const hrStats = {
  totalStaff: 45,
  presentToday: 42,
  absentToday: 3,
  pendingLeaves: 5,
  departmentDistribution: [
    { name: "Academic", value: 30 },
    { name: "Admin", value: 5 },
    { name: "Finance", value: 4 },
    { name: "Support", value: 6 }
  ],
  attendanceTrend: [
    { month: "Jan", attendance: 95 },
    { month: "Feb", attendance: 92 },
    { month: "Mar", attendance: 96 },
    { month: "Apr", attendance: 94 }
  ]
};
