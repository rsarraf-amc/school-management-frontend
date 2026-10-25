export const exams = [
  { id: 1, title: "Half Yearly Examination", type: "Main Exam", session: "2024-25", status: "Published" },
  { id: 2, title: "Monthly Test - April", type: "Class Test", session: "2024-25", status: "Pending" },
  { id: 3, title: "Final Examination", type: "Main Exam", session: "2024-25", status: "Closed" }
];

export const examTypes = [
  { id: 1, name: "Main Exam", description: "Standard term exams" },
  { id: 2, name: "Class Test", description: "Regular monthly tests" },
  { id: 3, name: "Practical", description: "Laboratory assessments" }
];

export const examGrades = [
  { id: 1, name: "A+", from: 91, to: 100, point: 10, remark: "Outstanding" },
  { id: 2, name: "A", from: 81, to: 90, point: 9, remark: "Excellent" },
  { id: 3, name: "B", from: 71, to: 80, point: 8, remark: "Very Good" },
  { id: 4, name: "C", from: 61, to: 70, point: 7, remark: "Good" }
];

export const assessments = [
  { id: 1, name: "Periodic Test", maxMarks: 20 },
  { id: 2, name: "Notebook Submission", maxMarks: 5 },
  { id: 3, name: "Subject Enrichment", maxMarks: 5 }
];

export const observations = [
  { id: 1, name: "Punctuality", type: "Personal Traits" },
  { id: 2, name: "Leadership", type: "Personal Traits" },
  { id: 3, name: "Communication Skills", type: "Co-Curricular" }
];

export const observationTypes = [
  { id: 1, name: "Personal Traits" },
  { id: 2, name: "Co-Curricular" },
  { id: 3, name: "Health & Physical Education" }
];

export const examStats = {
  upcomingExams: 3,
  resultsPublished: 15,
  avgPerformance: "78%",
  performanceTrend: [
    { month: "Jan", score: 72 },
    { month: "Feb", score: 75 },
    { month: "Mar", score: 70 },
    { month: "Apr", score: 78 }
  ],
  gradeDistribution: [
    { name: "A+", value: 15 },
    { name: "A", value: 25 },
    { name: "B", value: 35 },
    { name: "C", value: 20 },
    { name: "D", value: 5 }
  ]
};
