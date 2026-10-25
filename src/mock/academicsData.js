export const classes = [
  { id: 1, name: "Class 10", sections: ["A", "B"] },
  { id: 2, name: "Class 11", sections: ["A", "B", "C"] },
  { id: 3, name: "Class 12", sections: ["A", "B"] },
];

export const sections = [
  { id: 1, name: "A" },
  { id: 2, name: "B" },
  { id: 3, name: "C" },
];

export const subjects = [
  { id: 1, name: "Mathematics", code: "MATH101", type: "Theory" },
  { id: 2, name: "Science", code: "SCI101", type: "Theory/Practical" },
  { id: 3, name: "English", code: "ENG101", type: "Theory" },
  { id: 4, name: "Social Science", code: "SS101", type: "Theory" },
];

export const holidaysList = [
  { id: 1, name: "Summer Vacation", from: "2024-05-15", to: "2024-06-15", description: "Annual summer break" },
  { id: 2, name: "Diwali Break", from: "2024-11-01", to: "2024-11-05", description: "Festival holidays" },
];

export const promotionData = [
  { id: 1, name: "Aarav Sharma", admissionNo: "ADM-001", result: "Pass", status: "Continue" },
  { id: 2, name: "Ishani Verma", admissionNo: "ADM-002", result: "Pass", status: "Continue" },
  { id: 3, name: "Vivaan Reddy", admissionNo: "ADM-003", result: "Fail", status: "Continue" },
];

export const academicsStats = {
  totalClasses: 12,
  totalSubjects: 24,
  totalTeachers: 35,
  avgPromotionRate: "94%",
  promotionRateData: [
    { name: 'Passed', value: 94 },
    { name: 'Failed', value: 6 },
  ],
  classDistributionData: [
    { name: 'Class 10', count: 85 },
    { name: 'Class 11', count: 72 },
    { name: 'Class 12', count: 68 },
    { name: 'Class 9', count: 90 },
  ]
};

export const timetableData = [
  { day: "Monday", periods: [
    { time: "09:00 - 09:45", subject: "Math", teacher: "Mr. Gupta" },
    { time: "09:45 - 10:30", subject: "Science", teacher: "Ms. Sharma" },
    { time: "10:30 - 11:15", subject: "Break", teacher: "-" },
  ]},
  { day: "Tuesday", periods: [
    { time: "09:00 - 09:45", subject: "English", teacher: "Ms. Iyer" },
    { time: "09:45 - 10:30", subject: "Math", teacher: "Mr. Gupta" },
  ]},
];
