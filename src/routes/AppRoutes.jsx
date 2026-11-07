import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const TeacherLayout = lazy(() => import("../layouts/TeacherLayout"));
const StudentLayout = lazy(() => import("../layouts/StudentLayout"));

// Public Pages
const LandingPage = lazy(() => import("../pages/landing/LandingPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const FrontOffice = lazy(() =>
  import("../pages/admin/front-office/FrontOffice"),
);
const FeesCollection = lazy(() => import("../pages/admin/fees/FeesCollection"));
const IncomeManagement = lazy(() =>
  import("../pages/admin/income/IncomeManagement"),
);
const ExpenseManagement = lazy(() =>
  import("../pages/admin/expense/ExpenseManagement"),
);
const AttendanceManagement = lazy(() =>
  import("../pages/admin/attendance/AttendanceManagement"),
);
const AcademicsManagement = lazy(() =>
  import("../pages/admin/academics/AcademicsManagement"),
);
const HrManagement = lazy(() =>
  import("../pages/admin/hr/HrManagement"),
);
const HomeworkManagement = lazy(() =>
  import("../pages/admin/homework/HomeworkManagement"),
);
const LibraryManagement = lazy(() =>
  import("../pages/admin/library/LibraryManagement"),
);
const TransportManagement = lazy(() =>
  import("../pages/admin/transport/TransportManagement"),
);
const ReportsManagement = lazy(() =>
  import("../pages/admin/reports/ReportsManagement"),
);
const CommunicateManagement = lazy(() =>
  import("../pages/admin/communicate/CommunicateManagement"),
);
const ExamManagement = lazy(() =>
  import("../pages/admin/exam/ExamManagement"),
);
const StoreManagement = lazy(() =>
  import("../pages/admin/store/StoreManagement"),
);
const ComingSoon = lazy(() => import("../pages/ComingSoon"));

// Student Module Components (Nested)
const StudentInformation = lazy(() => import("../pages/admin/student/StudentInformation"));
const StudentHub = lazy(() => import("../components/admin/student/StudentHub"));
const StudentListing = lazy(() =>
  import("../components/admin/student/StudentListing"),
);
const StudentForm = lazy(() =>
  import("../components/admin/student/StudentForm"),
);
const StudentProfileView = lazy(() =>
  import("../components/admin/student/StudentProfileView"),
);

const StudentAdmissionReport = lazy(() =>
  import("../components/admin/student/StudentSubModules").then((m) => ({
    default: m.AdmissionReport,
  })),
);
const StudentHistory = lazy(() =>
  import("../components/admin/student/StudentSubModules").then((m) => ({
    default: m.StudentHistory,
  })),
);
const StudentLoginCredentials = lazy(() =>
  import("../components/admin/student/StudentSubModules").then((m) => ({
    default: m.StudentLoginCredentials,
  })),
);
const StudentCategory = lazy(() =>
  import("../components/admin/student/StudentSubModules").then((m) => ({
    default: m.StudentCategory,
  })),
);
const AssignStudentSubject = lazy(() =>
  import("../components/admin/student/StudentSubModules").then((m) => ({
    default: m.AssignStudentSubject,
  })),
);

// Income Module Components (Nested)
const IncomeHub = lazy(() => import("../components/admin/income/IncomeHub"));
const AddIncome = lazy(() => import("../components/admin/income/AddIncome"));
const SearchIncome = lazy(() =>
  import("../components/admin/income/SearchIncome"),
);
const IncomeHead = lazy(() => import("../components/admin/income/IncomeHead"));

// Expense Module Components (Nested)
const ExpenseHub = lazy(() => import("../components/admin/expense/ExpenseHub"));
const AddExpense = lazy(() => import("../components/admin/expense/AddExpense"));
const SearchExpense = lazy(() =>
  import("../components/admin/expense/SearchExpense"),
);
const ExpenseHead = lazy(() =>
  import("../components/admin/expense/ExpenseHead"),
);

// Attendance Module Components (Nested)
const AttendanceHub = lazy(() =>
  import("../components/admin/attendance/AttendanceHub"),
);
const StudentAttendance = lazy(() =>
  import("../components/admin/attendance/StudentAttendance"),
);
const DailyAttendance = lazy(() =>
  import("../components/admin/attendance/DailyAttendance"),
);
const AttendanceReports = lazy(() =>
  import("../components/admin/attendance/AttendanceReports"),
);

// Academics Module Components (Nested)
const AcademicsHub = lazy(() =>
  import("../components/admin/academics/AcademicsHub"),
);
const SubjectManagement = lazy(() =>
  import("../components/admin/academics/SubjectManagement"),
);
const ClassSectionManagement = lazy(() =>
  import("../components/admin/academics/ClassSectionManagement"),
);
const AssignSubjects = lazy(() =>
  import("../components/admin/academics/AssignSubjects"),
);
const PromoteStudents = lazy(() =>
  import("../components/admin/academics/PromoteStudents"),
);
const TimeTableManagement = lazy(() =>
  import("../components/admin/academics/TimeTableManagement"),
);
const HolidayManagement = lazy(() =>
  import("../components/admin/academics/HolidayManagement"),
);
const CertificateManagement = lazy(() =>
  import("../components/admin/academics/CertificateManagement"),
);

// HR Module Components (Nested)
const HrHub = lazy(() => import("../components/admin/hr/HrHub"));
const AddStaff = lazy(() => import("../components/admin/hr/AddStaff"));
const StaffDirectory = lazy(() => import("../components/admin/hr/StaffDirectory"));
const ManualAttendance = lazy(() => import("../components/admin/hr/ManualAttendance"));
const AttendanceReport = lazy(() => import("../components/admin/hr/AttendanceReport"));
const Payroll = lazy(() => import("../components/admin/hr/Payroll"));
const ApplyLeave = lazy(() => import("../components/admin/hr/ApplyLeave"));
const ApproveLeave = lazy(() => import("../components/admin/hr/ApproveLeave"));
const LeaveType = lazy(() => import("../components/admin/hr/LeaveType"));
const DepartmentManagement = lazy(() => import("../components/admin/hr/DepartmentManagement"));
const DesignationManagement = lazy(() => import("../components/admin/hr/DesignationManagement"));
const ShiftManagement = lazy(() => import("../components/admin/hr/ShiftManagement"));

// Homework Module Components (Nested)
const HomeworkHub = lazy(() => import("../components/admin/homework/HomeworkHub"));
const AddHomework = lazy(() => import("../components/admin/homework/AddHomework"));
const SubmissionDetails = lazy(() => import("../components/admin/homework/SubmissionDetails"));

// Library Module Components (Nested)
const LibraryHub = lazy(() => import("../components/admin/library/LibraryHub"));
const AddBook = lazy(() => import("../components/admin/library/AddBook"));
const BookList = lazy(() => import("../components/admin/library/BookList"));
const IssueReturn = lazy(() => import("../components/admin/library/IssueReturn"));
const AddStudent = lazy(() => import("../components/admin/library/AddStudent"));
const Category = lazy(() => import("../components/admin/library/Category"));
const MonthlyReport = lazy(() => import("../components/admin/library/MonthlyReport"));

// Transport Module Components (Nested)
const TransportHub = lazy(() => import("../components/admin/transport/TransportHub"));
const RoutesManagement = lazy(() => import("../components/admin/transport/RoutesManagement"));
const VehiclesManagement = lazy(() => import("../components/admin/transport/VehiclesManagement"));
const AssignVehicles = lazy(() => import("../components/admin/transport/AssignVehicles"));
const TransportReport = lazy(() => import("../components/admin/transport/TransportReport"));
const AssignStudentTransport = lazy(() => import("../components/admin/transport/AssignStudentTransport"));
const AddDriver = lazy(() => import("../components/admin/transport/AddDriver"));
const RouteTimeTable = lazy(() => import("../components/admin/transport/RouteTimeTable"));
const StoppageManagement = lazy(() => import("../components/admin/transport/StoppageManagement"));

// Reports Module Components (Nested)
const ReportsHub = lazy(() => import("../components/admin/reports/ReportsHub"));
const ReportsAdmissionReport = lazy(() => import("../components/admin/reports/AdmissionReport"));
const TransactionReport = lazy(() => import("../components/admin/reports/TransactionReport"));
const FeesReport = lazy(() => import("../components/admin/reports/FeesReport"));
const PayrollReport = lazy(() => import("../components/admin/reports/PayrollReport"));

// Communicate Module Components (Nested)
const CommunicateHub = lazy(() => import("../components/admin/communicate/CommunicateHub"));
const NoticeBoard = lazy(() => import("../components/admin/communicate/NoticeBoard"));
const SendSMS = lazy(() => import("../components/admin/communicate/SendSMS"));

// Examination Module Components (Nested)
const ExamHub = lazy(() => import("../components/admin/exam/ExamHub"));
const ExamSchedule = lazy(() => import("../components/admin/exam/ExamSchedule"));
const AssignMarks = lazy(() => import("../components/admin/exam/AssignMarks"));
const ExamList = lazy(() => import("../components/admin/exam/ExamList"));
const SingleResult = lazy(() => import("../components/admin/exam/SingleResult"));
const AdmitCard = lazy(() => import("../components/admin/exam/AdmitCard"));
const MarksReport = lazy(() => import("../components/admin/exam/MarksReport"));
const ExamType = lazy(() => import("../components/admin/exam/ExamType"));
const Assessment = lazy(() => import("../components/admin/exam/Assessment"));
const Observation = lazy(() => import("../components/admin/exam/Observation"));
const ObservationType = lazy(() => import("../components/admin/exam/ObservationType"));
const ExamGrade = lazy(() => import("../components/admin/exam/ExamGrade"));
const ExamInstruction = lazy(() => import("../components/admin/exam/ExamInstruction"));

// Store Module Components (Nested)
const StoreHub = lazy(() => import("../components/admin/store/StoreHub"));
const VendorManagement = lazy(() => import("../components/admin/store/VendorManagement"));
const ProductManagement = lazy(() => import("../components/admin/store/ProductManagement"));
const CategoryManagement = lazy(() => import("../components/admin/store/CategoryManagement"));
const SubCategoryManagement = lazy(() => import("../components/admin/store/SubCategoryManagement"));
const InventoryTransactions = lazy(() => import("../components/admin/store/InventoryTransactions"));
const UnitManagement = lazy(() => import("../components/admin/store/UnitManagement"));
const SellsReports = lazy(() => import("../components/admin/store/SellsReports"));

const TeacherDashboard = lazy(() =>
  import("../pages/teacher/TeacherDashboard"),
);
const StudentDashboard = lazy(() =>
  import("../pages/student/StudentDashboard"),
);

// Helper for loading states
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppRoutes() {
  const { user } = useSelector((state) => state.auth);

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "admin":
        return "/admin";
      case "teacher":
        return "/teacher";
      case "student":
        return "/student";
      default:
        return "/";
    }
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={getDashboardPath()} replace />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={getDashboardPath()} replace />
              ) : (
                <LoginPage />
              )
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="front-office/*" element={<FrontOffice />} />
          <Route path="fees/*" element={<FeesCollection />} />

          {/* Centralized Student Module Nested Routing */}
          <Route path="student" element={<StudentInformation />}>
            <Route index element={<StudentHub />} />
            <Route path="list" element={<StudentListing />} />
            <Route path="add" element={<StudentForm />} />
            <Route path="edit/:id" element={<StudentForm />} />
            <Route path="view/:id" element={<StudentProfileView />} />
            <Route path="admission-report" element={<StudentAdmissionReport />} />
            <Route path="history" element={<StudentHistory />} />
            <Route
              path="login-credentials"
              element={<StudentLoginCredentials />}
            />
            <Route path="category" element={<StudentCategory />} />
            <Route path="assign-subject" element={<AssignStudentSubject />} />
          </Route>

          <Route path="income" element={<IncomeManagement />}>
            <Route index element={<IncomeHub />} />
            <Route path="add" element={<AddIncome />} />
            <Route path="search" element={<SearchIncome />} />
            <Route path="income-head" element={<IncomeHead />} />
          </Route>

          <Route path="expense" element={<ExpenseManagement />}>
            <Route index element={<ExpenseHub />} />
            <Route path="add" element={<AddExpense />} />
            <Route path="search" element={<SearchExpense />} />
            <Route path="expense-head" element={<ExpenseHead />} />
          </Route>

          <Route path="attendance" element={<AttendanceManagement />}>
            <Route index element={<AttendanceHub />} />
            <Route path="manual" element={<StudentAttendance />} />
            <Route path="daily" element={<DailyAttendance />} />
            <Route path="report" element={<AttendanceReports />} />
          </Route>
          <Route path="academics" element={<AcademicsManagement />}>
            <Route index element={<AcademicsHub />} />
            <Route path="subjects" element={<SubjectManagement />} />
            <Route
              path="class-sections"
              element={<ClassSectionManagement />}
            />
            <Route path="assign-subjects" element={<AssignSubjects />} />
            <Route path="promote" element={<PromoteStudents />} />
            <Route path="timetable" element={<TimeTableManagement />} />
            <Route path="holidays" element={<HolidayManagement />} />
            <Route path="certificates" element={<CertificateManagement />} />
          </Route>
          <Route path="hr" element={<HrManagement />}>
            <Route index element={<HrHub />} />
            <Route path="add-staff" element={<AddStaff />} />
            <Route path="directory" element={<StaffDirectory />} />
            <Route path="manual-attendance" element={<ManualAttendance />} />
            <Route path="attendance-report" element={<AttendanceReport />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="apply-leave" element={<ApplyLeave />} />
            <Route path="approve-leave" element={<ApproveLeave />} />
            <Route path="leave-type" element={<LeaveType />} />
            <Route path="department" element={<DepartmentManagement />} />
            <Route path="designation" element={<DesignationManagement />} />
            <Route path="shift" element={<ShiftManagement />} />
          </Route>
          <Route path="homework" element={<HomeworkManagement />}>
            <Route index element={<HomeworkHub />} />
            <Route path="add" element={<AddHomework />} />
            <Route path="submissions" element={<SubmissionDetails />} />
          </Route>

          <Route path="library" element={<LibraryManagement />}>
            <Route index element={<LibraryHub />} />
            <Route path="add-book" element={<AddBook />} />
            <Route path="book-list" element={<BookList />} />
            <Route path="issue-return" element={<IssueReturn />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="category" element={<Category />} />
            <Route path="monthly-report" element={<MonthlyReport />} />
          </Route>

          <Route path="transport" element={<TransportManagement />}>
            <Route index element={<TransportHub />} />
            <Route path="routes" element={<RoutesManagement />} />
            <Route path="vehicles" element={<VehiclesManagement />} />
            <Route path="assign-vehicles" element={<AssignVehicles />} />
            <Route path="report" element={<TransportReport />} />
            <Route path="assign-student" element={<AssignStudentTransport />} />
            <Route path="drivers" element={<AddDriver />} />
            <Route path="timetable" element={<RouteTimeTable />} />
            <Route path="stoppage" element={<StoppageManagement />} />
          </Route>

          <Route path="reports" element={<ReportsManagement />}>
            <Route index element={<ReportsHub />} />
            <Route path="admissions" element={<ReportsAdmissionReport />} />
            <Route path="transactions" element={<TransactionReport />} />
            <Route path="fees" element={<FeesReport />} />
            <Route path="payroll" element={<PayrollReport />} />
          </Route>

          <Route path="communicate" element={<CommunicateManagement />}>
            <Route index element={<CommunicateHub />} />
            <Route path="notice-board" element={<NoticeBoard />} />
            <Route path="sms" element={<SendSMS />} />
          </Route>

          <Route path="exam" element={<ExamManagement />}>
            <Route index element={<ExamHub />} />
            <Route path="schedule" element={<ExamSchedule />} />
            <Route path="assign-marks" element={<AssignMarks />} />
            <Route path="exam-list" element={<ExamList />} />
            <Route path="single-result" element={<SingleResult />} />
            <Route path="admit-card" element={<AdmitCard />} />
            <Route path="marks-report" element={<MarksReport />} />
            <Route path="exam-type" element={<ExamType />} />
            <Route path="assessment" element={<Assessment />} />
            <Route path="observation" element={<Observation />} />
            <Route path="observation-type" element={<ObservationType />} />
            <Route path="exam-grade" element={<ExamGrade />} />
            <Route path="exam-instruction" element={<ExamInstruction />} />
          </Route>

          <Route path="store" element={<StoreManagement />}>
            <Route index element={<StoreHub />} />
            <Route path="vendors" element={<VendorManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="category" element={<CategoryManagement />} />
            <Route path="sub-category" element={<SubCategoryManagement />} />
            <Route path="transactions" element={<InventoryTransactions />} />
            <Route path="units" element={<UnitManagement />} />
            <Route path="reports" element={<SellsReports />} />
          </Route>

          <Route
            path="gallery"
            element={<ComingSoon title="Media Gallery" />}
          />
          <Route
            path="accounts"
            element={<ComingSoon title="Financial Accounts" />}
          />
          <Route
            path="settings"
            element={<ComingSoon title="General Settings" />}
          />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            user?.role === "teacher" ? (
              <TeacherLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route
            path="attendance"
            element={<ComingSoon title="Student Attendance" />}
          />
          <Route path="classes" element={<ComingSoon title="My Classes" />} />
          <Route
            path="homework"
            element={<ComingSoon title="Assign Homework" />}
          />
          <Route path="exams" element={<ComingSoon title="Manage Exams" />} />
          <Route
            path="library"
            element={<ComingSoon title="Digital Library" />}
          />
          <Route
            path="reports"
            element={<ComingSoon title="Academic Reports" />}
          />
          <Route
            path="communicate"
            element={<ComingSoon title="Communication" />}
          />
          <Route
            path="settings"
            element={<ComingSoon title="Faculty Settings" />}
          />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            user?.role === "student" ? (
              <StudentLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="fees" element={<ComingSoon title="Fees & Dues" />} />
          <Route
            path="attendance"
            element={<ComingSoon title="My Attendance" />}
          />
          <Route path="homework" element={<ComingSoon title="My Homework" />} />
          <Route path="results" element={<ComingSoon title="Exam Results" />} />
          <Route
            path="library"
            element={<ComingSoon title="Digital Library" />}
          />
          <Route
            path="transport"
            element={<ComingSoon title="Transport Info" />}
          />
          <Route path="notices" element={<ComingSoon title="Notice Board" />} />
          <Route path="profile" element={<ComingSoon title="My Profile" />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
