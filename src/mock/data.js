// Mock Data for School Management System

export const users = [
  { id: 'u1', name: 'Admin User', email: 'admin@school.com', password: 'password', role: 'admin' },
  { id: 'u2', name: 'John Teacher', email: 'teacher@school.com', password: 'password', role: 'teacher' },
  { id: 'u3', name: 'Alice Student', email: 'student@school.com', password: 'password', role: 'student' },
];

export const students = [
  {
    id: 's1',
    userId: 'u3',
    name: 'Alice Student',
    classId: 'c1',
    attendance: 92,
    marks: { Math: 85, Science: 90, English: 78 }
  }
];

export const teachers = [
  {
    id: 't1',
    userId: 'u2',
    name: 'John Teacher',
    subjects: ['Math', 'Science'],
    classes: ['c1']
  }
];

export const classes = [
  { id: 'c1', name: 'Grade 10 - A', teacherId: 't1', studentCount: 30 }
];
