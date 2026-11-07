export const homeworkList = [
  {
    id: 1,
    class: "10",
    section: "A",
    subjectGroup: "Science",
    subject: "Physics",
    homeworkDate: "2024-04-20",
    submissionDate: "2024-04-25",
    evaluatedBy: "Mr. Gupta",
    status: "Evaluated",
    createdDate: "2024-04-19"
  },
  {
    id: 2,
    class: "10",
    section: "A",
    subjectGroup: "Maths",
    subject: "Algebra",
    homeworkDate: "2024-04-22",
    submissionDate: "2024-04-28",
    evaluatedBy: "",
    status: "Pending",
    createdDate: "2024-04-21"
  },
  {
    id: 3,
    class: "9",
    section: "B",
    subjectGroup: "Languages",
    subject: "English",
    homeworkDate: "2024-04-23",
    submissionDate: "2024-04-26",
    evaluatedBy: "",
    status: "Pending",
    createdDate: "2024-04-22"
  }
];

export const submissionsData = [
  {
    id: 1,
    studentName: "Aarav Sharma",
    admissionNo: "ADM-001",
    status: "Submitted",
    evaluationNotes: "Good effort",
    marks: "8/10"
  },
  {
    id: 2,
    studentName: "Ishani Verma",
    admissionNo: "ADM-002",
    status: "Pending",
    evaluationNotes: "",
    marks: ""
  },
  {
    id: 3,
    studentName: "Rahul Gupta",
    admissionNo: "ADM-003",
    status: "Evaluated",
    evaluationNotes: "Excellent work",
    marks: "10/10"
  }
];

export const homeworkStats = {
  totalAssignments: 124,
  evaluated: 89,
  pendingEvaluation: 35,
  avgCompletionRate: "82%",
  subjectDistribution: [
    { name: "Mathematics", value: 35 },
    { name: "Science", value: 40 },
    { name: "Languages", value: 25 },
    { name: "Social Studies", value: 15 },
    { name: "Computer", value: 9 }
  ],
  weeklyTrend: [
    { day: "Mon", assigned: 12, submitted: 10 },
    { day: "Tue", assigned: 15, submitted: 12 },
    { day: "Wed", assigned: 8, submitted: 14 },
    { day: "Thu", assigned: 20, submitted: 18 },
    { day: "Fri", assigned: 10, submitted: 15 },
  ]
};
