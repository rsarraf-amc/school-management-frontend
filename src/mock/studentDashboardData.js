// Student Dashboard Mock Data
export const studentMarksProgression = [
  { exam: "Unit 1", math: 85, science: 78, english: 92 },
  { exam: "Unit 2", math: 88, science: 82, english: 90 },
  { exam: "Quarterly", math: 82, science: 85, english: 88 },
  { exam: "Unit 3", math: 92, science: 89, english: 94 },
  { exam: "Half Yearly", math: 95, science: 92, english: 93 },
];

export const studentHomework = [
  {
    id: 1,
    subject: "Mathematics",
    task: "Solve Exercise 5.2",
    dueDate: "Tomorrow",
    status: "Pending",
  },
  {
    id: 2,
    subject: "Science",
    task: "Physics Lab Report",
    dueDate: "12 Apr",
    status: "In Progress",
  },
  {
    id: 3,
    subject: "English",
    task: "Essay on Shakespeare",
    dueDate: "Completed",
    status: "Done",
  },
];

export const upcomingExams = [
  { subject: "Math Finals", date: "25 Apr 2024", time: "10:00 AM" },
  { subject: "Physics Practical", date: "28 Apr 2024", time: "09:00 AM" },
  { subject: "History Unit", date: "02 May 2024", time: "11:30 AM" },
];

export const studentFinance = {
  totalFees: "₹45,000",
  paidAmount: "₹35,000",
  balanceAmount: "₹10,000",
  nextDueDate: "20 Apr 2024",
  transactions: [
    {
      id: 1,
      title: "Quarterly Tuition Fees",
      amount: "₹15,000",
      date: "Jan 15",
      status: "Paid",
    },
    {
      id: 2,
      title: "Transport Fees",
      amount: "₹5,000",
      date: "Feb 02",
      status: "Paid",
    },
    {
      id: 3,
      title: "Library Membership",
      amount: "₹2,000",
      date: "Mar 10",
      status: "Paid",
    },
  ],
};

export const studentStats = [
  {
    title: "Attendance",
    value: "92%",
    subValue: "Present: 165/180 days",
    icon: "Calendar",
    color: "emerald",
    trend: "+2%",
  },
  {
    title: "Average Grade",
    value: "A-",
    subValue: "CGPA: 8.7/10",
    icon: "Trophy",
    color: "amber",
    trend: "+0.3",
  },
  {
    title: "Homework",
    value: "8/10",
    subValue: "Completed this week",
    icon: "BookOpen",
    color: "indigo",
    trend: "+1",
  },
  {
    title: "Fees Balance",
    value: "₹10,000",
    subValue: "Due: 20 Apr 2024",
    icon: "CreditCard",
    color: "rose",
    trend: "-₹5,000",
  },
];
