// Teacher Dashboard Mock Data
export const teacherClassPerformance = [
  { name: "Class 10-A", avgMarks: 85, attendance: 92 },
  { name: "Class 10-B", avgMarks: 78, attendance: 88 },
  { name: "Class 9-C", avgMarks: 92, attendance: 95 },
  { name: "Class 8-A", avgMarks: 70, attendance: 82 },
];

export const teacherWeeklySchedule = [
  { time: "09:00 AM", subject: "Mathematics", class: "10-A", room: "Room 201" },
  { time: "10:30 AM", subject: "Physics", class: "12-B", room: "Lab 1" },
  { time: "12:00 PM", subject: "Mathematics", class: "9-C", room: "Room 105" },
  {
    time: "02:00 PM",
    subject: "Doubt Session",
    class: "Mixed",
    room: "Library",
  },
];

export const teacherStats = [
  {
    title: "Classes Today",
    value: "4",
    subValue: "2 completed",
    icon: "BookOpen",
    color: "indigo",
    trend: "Normal",
  },
  {
    title: "Students",
    value: "120",
    subValue: "Across 3 classes",
    icon: "Users",
    color: "emerald",
    trend: "+5",
  },
  {
    title: "Homework",
    value: "8",
    subValue: "Pending review",
    icon: "ClipboardList",
    color: "amber",
    trend: "-2",
  },
  {
    title: "Attendance",
    value: "94%",
    subValue: "Class average",
    icon: "CheckCircle",
    color: "rose",
    trend: "+1%",
  },
];

export const classTableColumns = [
  {
    header: "Class",
    accessor: "name",
    render: (row) => (
      <span className="font-bold text-indigo-600">{row.name}</span>
    ),
  },
  {
    header: "Students",
    accessor: "studentCount",
    render: (row) => (
      <span className="font-bold text-slate-700">{row.studentCount}</span>
    ),
  },
  {
    header: "Avg. Marks",
    accessor: "avgMarks",
    render: (row) => (
      <span
        className={`font-bold ${
          row.avgMarks >= 85
            ? "text-emerald-600"
            : row.avgMarks >= 70
            ? "text-amber-600"
            : "text-rose-600"
        }`}
      >
        {row.avgMarks}%
      </span>
    ),
  },
  {
    header: "Attendance",
    accessor: "attendance",
    render: (row) => (
      <span
        className={`font-bold ${
          row.attendance >= 90
            ? "text-emerald-600"
            : row.attendance >= 80
            ? "text-amber-600"
            : "text-rose-600"
        }`}
      >
        {row.attendance}%
      </span>
    ),
  },
];
