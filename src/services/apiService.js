import { users, students, teachers, classes } from '../mock/data';

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // --- Auth API ---
  async login(email, password) {
    await delay(500); // simulate delay
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    
    // Omit password from response
    const { password: _, ...userData } = user;
    return { user: userData, token: 'mock-jwt-token-123' };
  },

  // --- Admin APIs ---
  async getAllStudents() {
    await delay(500);
    return students;
  },
  async getAllTeachers() {
    await delay(500);
    return teachers;
  },
  async getAllClasses() {
    await delay(500);
    return classes;
  },

  // --- Teacher APIs ---
  async getTeacherClasses(teacherUserId) {
    await delay(500);
    const teacher = teachers.find(t => t.userId === teacherUserId);
    if (!teacher) return [];
    return classes.filter(c => teacher.classes.includes(c.id));
  },
  async getStudentsByClass(classId) {
    await delay(500);
    return students.filter(s => s.classId === classId);
  },

  // --- Student APIs ---
  async getStudentProfile(studentUserId) {
    await delay(500);
    const student = students.find(s => s.userId === studentUserId);
    if (!student) throw new Error('Student not found');
    return student;
  }
};
