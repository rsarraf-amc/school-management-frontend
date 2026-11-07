// Front Office Module Mock Data
export const frontOfficeStats = {
  totalEnquiries: 42,
  activeEnquiries: 12,
  closedEnquiries: 30,
};

export const postalReceiveStats = {
  totalReceived: "2,105",
  awaitingSort: "15",
  distributed: "2,090",
};

export const postalDispatchStats = {
  totalDispatches: "1,245",
  pendingDelivery: "38",
  deliveredSuccessfully: "850",
};

export const phoneLogStats = {
  totalCallsToday: "156",
  incomingCalls: "98",
  outgoingCalls: "58",
};

export const admissionEnquiryStats = {
  totalEnquiries: "1,245",
  activeEnquiries: "384",
  closedEnquiries: "850",
  pendingFollowUp: "45",
};

export const frontOfficeOverviewStats = {
  totalVisitors: "2,543",
  todayVisitors: "145",
};

export const complainsStats = {
  totalComplains: "12",
  pending: "5",
  inProgress: "3",
  resolved: "4",
};

export const weeklyData = [
  { name: "Mon", enquiries: 40, visitors: 24 },
  { name: "Tue", enquiries: 30, visitors: 13 },
  { name: "Wed", enquiries: 20, visitors: 58 },
  { name: "Thu", enquiries: 27, visitors: 39 },
  { name: "Fri", enquiries: 18, visitors: 48 },
  { name: "Sat", enquiries: 23, visitors: 38 },
  { name: "Sun", enquiries: 34, visitors: 43 },
];

export const admissionEnquiriesData = [
  {
    id: "EN-01",
    name: "Aarav Kumar",
    phone: "+91 9876543210",
    source: "Website",
    date: "15-04-2026",
    class: "Class 1",
    status: "Active",
    nextFollowUp: "20-04-2026",
  },
  {
    id: "EN-02",
    name: "Priya Singh",
    phone: "+91 9876543211",
    source: "Walk-in",
    date: "14-04-2026",
    class: "Class 5",
    status: "Closed",
    nextFollowUp: "-",
  },
  {
    id: "EN-03",
    name: "Rohan Patel",
    phone: "+91 9876543212",
    source: "Reference",
    date: "14-04-2026",
    class: "Class 9",
    status: "Follow up",
    nextFollowUp: "18-04-2026",
  },
  {
    id: "EN-04",
    name: "Ananya Sharma",
    phone: "+91 9876543213",
    source: "Advertisement",
    date: "13-04-2026",
    class: "Class 11",
    status: "Active",
    nextFollowUp: "22-04-2026",
  },
];

export const visitorBookData = [
  {
    id: "VIS-101",
    name: "Vikram Malhotra",
    purpose: "Admissions Info",
    phone: "+91 9123456780",
    date: "15 Apr 2024",
    inTime: "09:30 AM",
    outTime: "10:15 AM",
  },
  {
    id: "VIS-102",
    name: "Sunita Roy",
    purpose: "Parent Meeting (Class 10)",
    phone: "+91 9123456781",
    date: "15 Apr 2024",
    inTime: "11:00 AM",
    outTime: "11:45 AM",
  },
  {
    id: "VIS-103",
    name: "Rajesh Gupta",
    purpose: "Vendor/Supplier",
    phone: "+91 9123456782",
    date: "15 Apr 2024",
    inTime: "12:15 PM",
    outTime: "Pending",
  },
];

export const phoneCallLogData = [
  {
    id: 1,
    name: "Suresh Das",
    phone: "+91 8888888880",
    date: "15 Apr 2024",
    duration: "05:20",
    type: "Incoming",
    description: "Enquiry about fee structure",
  },
  {
    id: 2,
    name: "Meena Gupta",
    phone: "+91 8888888881",
    date: "15 Apr 2024",
    duration: "02:15",
    type: "Outgoing",
    description: "Reminder for document submission",
  },
  {
    id: 3,
    name: "Unknown",
    phone: "+91 8888888882",
    date: "14 Apr 2024",
    duration: "00:45",
    type: "Incoming",
    description: "Wrong number",
  },
  {
    id: 4,
    name: "Ajay Verma",
    phone: "+91 8888888883",
    date: "14 Apr 2024",
    duration: "10:30",
    type: "Outgoing",
    description: "Discussed transport facility",
  },
];

export const complainData = [
  {
    id: "CMP-001",
    by: "Rahul Sharma (Class 10-A)",
    against: "Transport",
    date: "12 Apr 2024",
    status: "Resolved",
    description: "Bus no. 4 was delayed by 30 mins.",
  },
  {
    id: "CMP-002",
    by: "Priya Das (Parent)",
    against: "Academics",
    date: "14 Apr 2024",
    status: "Pending",
    description: "Request for timetable revision.",
  },
  {
    id: "CMP-003",
    by: "Amit Verma (Class 8-B)",
    against: "Infrastructure",
    date: "15 Apr 2024",
    status: "In Progress",
    description: "Fan not working in classroom.",
  },
];

export const postalDispatchData = [
  {
    id: "DSP-101",
    toTitle: "Board of Education",
    refNo: "REF/2024/001",
    address: "New Delhi, HQ",
    fromTitle: "Principal Office",
    date: "15 Apr 2024",
  },
  {
    id: "DSP-102",
    toTitle: "City Transport Dept",
    refNo: "REF/2024/002",
    address: "City Office",
    fromTitle: "Admin Office",
    date: "14 Apr 2024",
  },
];

export const postalReceiveData = [
  {
    id: "REC-101",
    fromTitle: "CBSE Regional",
    refNo: "CBSE/CR/892",
    address: "Regional Office",
    toTitle: "Principal",
    date: "15 Apr 2024",
  },
  {
    id: "REC-102",
    fromTitle: "EduTech Publishers",
    refNo: "PO/9912",
    address: "Mumbai",
    toTitle: "Librarian",
    date: "13 Apr 2024",
  },
];
