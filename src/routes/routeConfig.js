import { lazy } from 'react';

// Lazy load page components
const LandingPage = lazy(() => import('../pages/landing/LandingPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));

const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const FrontOffice = lazy(() => import('../pages/admin/front-office/FrontOffice'));
const FeesCollection = lazy(() => import('../pages/admin/fees/FeesCollection'));
const StudentInformation = lazy(() => import('../pages/admin/student/StudentInformation'));

const TeacherLayout = lazy(() => import('../layouts/TeacherLayout'));
const TeacherDashboard = lazy(() => import('../pages/teacher/TeacherDashboard'));

const StudentLayout = lazy(() => import('../layouts/StudentLayout'));
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));

const ComingSoon = lazy(() => import('../pages/ComingSoon'));

// Module sub-components for nested routing
const StudentHub = lazy(() => import('../components/admin/student/StudentHub'));
const StudentListing = lazy(() => import('../components/admin/student/StudentListing'));
const StudentForm = lazy(() => import('../components/admin/student/StudentForm'));
const StudentProfileView = lazy(() => import('../components/admin/student/StudentProfileView'));
const AdmissionReport = lazy(() => import('../components/admin/student/StudentSubModules').then(module => ({ default: module.AdmissionReport })));
const StudentHistory = lazy(() => import('../components/admin/student/StudentSubModules').then(module => ({ default: module.StudentHistory })));
const StudentLoginCredentials = lazy(() => import('../components/admin/student/StudentSubModules').then(module => ({ default: module.StudentLoginCredentials })));
const StudentCategory = lazy(() => import('../components/admin/student/StudentSubModules').then(module => ({ default: module.StudentCategory })));
const AssignStudentSubject = lazy(() => import('../components/admin/student/StudentSubModules').then(module => ({ default: module.AssignStudentSubject })));

export const routeConfig = [
  {
    path: '/',
    title: 'Home',
    element: LandingPage,
    isPublic: true,
  },
  {
    path: '/login',
    title: 'Login',
    element: LoginPage,
    isPublic: true,
  },
  {
    path: '/admin',
    element: AdminLayout,
    role: 'admin',
    children: [
      { path: '', element: AdminDashboard, title: 'Dashboard' },
      { path: 'dashboard', element: AdminDashboard, title: 'Dashboard' },
      { path: 'front-office/*', element: FrontOffice, title: 'Front Office' },
      { path: 'fees/*', element: FeesCollection, title: 'Fees Collection' },
      { 
        path: 'student', 
        element: StudentInformation, 
        title: 'Student Information',
        children: [
          { path: '', element: StudentHub, title: 'Student Hub' },
          { path: 'list', element: StudentListing, title: 'Student Directory' },
          { path: 'add', element: StudentForm, title: 'Student Admission' },
          { path: 'edit/:id', element: StudentForm, title: 'Edit Student' },
          { path: 'view/:id', element: StudentProfileView, title: 'Student Profile' },
          { path: 'admission-report', element: AdmissionReport, title: 'Admission Report' },
          { path: 'history', element: StudentHistory, title: 'Student History' },
          { path: 'login-credentials', element: StudentLoginCredentials, title: 'Login Credentials' },
          { path: 'category', element: StudentCategory, title: 'Student Category' },
          { path: 'assign-subject', element: AssignStudentSubject, title: 'Assign Subject' },
        ]
      },
      { path: 'income', element: ComingSoon, title: 'Income Management' },
      { path: 'expense', element: ComingSoon, title: 'Expense Management' },
      { path: 'attendance', element: ComingSoon, title: 'Attendance System' },
      { path: 'academics', element: ComingSoon, title: 'Academic Management' },
      { path: 'hr', element: ComingSoon, title: 'Human Resource' },
      { path: 'homework', element: ComingSoon, title: 'Homework Module' },
      { path: 'library', element: ComingSoon, title: 'Library System' },
      { path: 'transport', element: ComingSoon, title: 'Transport Management' },
      { path: 'reports', element: ComingSoon, title: 'Report Center' },
      { path: 'communicate', element: ComingSoon, title: 'Communication Center' },
      { path: 'exam', element: ComingSoon, title: 'Examination Center' },
      { path: 'store', element: ComingSoon, title: 'Inventory Store' },
      { path: 'gallery', element: ComingSoon, title: 'Media Gallery' },
      { path: 'accounts', element: ComingSoon, title: 'Financial Accounts' },
      { path: 'settings', element: ComingSoon, title: 'General Settings' },
    ]
  },
  {
    path: '/teacher',
    element: TeacherLayout,
    role: 'teacher',
    children: [
      { path: '', element: TeacherDashboard, title: 'Dashboard' },
      { path: 'dashboard', element: TeacherDashboard, title: 'Dashboard' },
      { path: 'attendance', element: ComingSoon, title: 'Student Attendance' },
      { path: 'classes', element: ComingSoon, title: 'My Classes' },
      { path: 'homework', element: ComingSoon, title: 'Assign Homework' },
      { path: 'exams', element: ComingSoon, title: 'Manage Exams' },
      { path: 'library', element: ComingSoon, title: 'Digital Library' },
      { path: 'reports', element: ComingSoon, title: 'Academic Reports' },
      { path: 'communicate', element: ComingSoon, title: 'Communication' },
      { path: 'settings', element: ComingSoon, title: 'Faculty Settings' },
    ]
  },
  {
    path: '/student',
    element: StudentLayout,
    role: 'student',
    children: [
      { path: '', element: StudentDashboard, title: 'Dashboard' },
      { path: 'dashboard', element: StudentDashboard, title: 'Dashboard' },
      { path: 'fees', element: ComingSoon, title: 'Fees & Dues' },
      { path: 'attendance', element: ComingSoon, title: 'My Attendance' },
      { path: 'homework', element: ComingSoon, title: 'My Homework' },
      { path: 'results', element: ComingSoon, title: 'Exam Results' },
      { path: 'library', element: ComingSoon, title: 'Digital Library' },
      { path: 'transport', element: ComingSoon, title: 'Transport Info' },
      { path: 'notices', element: ComingSoon, title: 'Notice Board' },
      { path: 'profile', element: ComingSoon, title: 'My Profile' },
    ]
  }
];
