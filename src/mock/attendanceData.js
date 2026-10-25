export const attendanceRecords = [
  { id: 1, name: "Aarav Sharma", admissionNo: "ADM-001", rollNo: "101", class: "10", section: "A", status: "Present", remark: "" },
  { id: 2, name: "Ishani Verma", admissionNo: "ADM-002", rollNo: "102", class: "10", section: "A", status: "Absent", remark: "Family event" },
  { id: 3, name: "Vivaan Reddy", admissionNo: "ADM-003", rollNo: "103", class: "10", section: "A", status: "Late", remark: "Bus delay" },
  { id: 4, name: "Ananya Iyer", admissionNo: "ADM-004", rollNo: "104", class: "10", section: "A", status: "Present", remark: "" },
  { id: 5, name: "Kabir Singh", admissionNo: "ADM-005", rollNo: "105", class: "10", section: "A", status: "Half Day", remark: "Doctor appointment" },
];

export const attendanceStats = {
  totalStudents: 450,
  presentToday: 412,
  absentToday: 28,
  onLeave: 10,
  avgAttendance: "91.5%"
};

export const attendanceTrendData = [
  { day: "Mon", present: 410, absent: 30, late: 10 },
  { day: "Tue", present: 420, absent: 20, late: 10 },
  { day: "Wed", present: 415, absent: 25, late: 10 },
  { day: "Thu", present: 405, absent: 35, late: 10 },
  { day: "Fri", present: 412, absent: 28, late: 10 },
  { day: "Sat", present: 390, absent: 50, late: 10 },
];

export const monthlyTrendData = [
  { month: "Jan", attendance: 94 },
  { month: "Feb", attendance: 92 },
  { month: "Mar", attendance: 95 },
  { month: "Apr", attendance: 91 },
  { month: "May", attendance: 89 },
  { month: "Jun", attendance: 93 },
];

export const monthlyAttendanceData = [
  { student: "Aarav Sharma", present: 22, absent: 2, late: 1, percentage: "88%" },
  { student: "Ishani Verma", present: 20, absent: 4, late: 1, percentage: "80%" },
  { student: "Vivaan Reddy", present: 24, absent: 0, late: 1, percentage: "96%" },
  { student: "Ananya Iyer", present: 25, absent: 0, late: 0, percentage: "100%" },
  { student: "Kabir Singh", present: 18, absent: 5, late: 2, percentage: "72%" },
];
