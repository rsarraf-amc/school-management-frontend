export const notices = [
  { id: 1, title: "Summer Vacation Announcement", date: "2024-05-15", visibleTo: ["Student", "Parent", "Teacher"], publishDate: "2024-05-10" },
  { id: 2, title: "Staff Meeting for Q2", date: "2024-04-20", visibleTo: ["Teacher", "Admin"], publishDate: "2024-04-18" },
  { id: 3, title: "Fee Submission Reminder", date: "2024-04-25", visibleTo: ["Parent"], publishDate: "2024-04-20" }
];

export const smsLogs = [
  { id: 1, date: "2024-04-18 10:30 AM", title: "Transport Delay Alert", recipientType: "Parent", group: "Route 1", status: "Delivered", count: 45 },
  { id: 2, date: "2024-04-15 09:00 AM", title: "PTM Reminder", recipientType: "Parent", group: "Class 10", status: "Delivered", count: 120 },
  { id: 3, date: "2024-04-10 14:15 PM", title: "Exam Schedule Update", recipientType: "Student", group: "Class 12", status: "Failed", count: 5 }
];

export const communicateStats = {
  totalNotices: 45,
  smsSent: 8500,
  deliveryRate: "98.5%",
  activeCampaigns: 2,
  communicationTrend: [
    { month: "Jan", sms: 1200, notices: 8 },
    { month: "Feb", sms: 2500, notices: 12 },
    { month: "Mar", sms: 1800, notices: 10 },
    { month: "Apr", sms: 3000, notices: 15 }
  ],
  audienceDistribution: [
    { name: "Parents", value: 60 },
    { name: "Students", value: 25 },
    { name: "Teachers", value: 10 },
    { name: "Admin", value: 5 }
  ]
};
