import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Download, ChevronRight } from "lucide-react";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function StudentInformation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Simple title mapping based on the leaf segment of the URL
  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/add"))
      return {
        title: "Student Admission",
        desc: "Register a new student into the system.",
      };
    if (path.includes("/edit"))
      return {
        title: "Edit Information",
        desc: "Update existing student credentials.",
      };
    if (path.includes("/view"))
      return {
        title: "Student Profile",
        desc: "Complete academic and personal overview.",
      };
    if (path.includes("/list"))
      return {
        title: "Student Directory",
        desc: "View and manage all student records effortlessly.",
      };
    if (path.includes("/admission-report"))
      return {
        title: "Admission Report",
        desc: "Analytical overview of campus admissions.",
      };
    if (path.includes("/history"))
      return {
        title: "Student History",
        desc: "Track historical records and progression.",
      };
    if (path.includes("/login-credentials"))
      return {
        title: "Login Credentials",
        desc: "System access management for students.",
      };
    if (path.includes("/category"))
      return {
        title: "Student Category",
        desc: "Configure institutional student groupings.",
      };
    if (path.includes("/assign-subject"))
      return {
        title: "Assign Subject",
        desc: "Map academic subjects to students.",
      };

    return {
      title: "Student Information",
      desc: "Comprehensive management hub for all student records and activities.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isList = location.pathname.endsWith("/list");
  const isIndex =
    location.pathname === "/admin/student" ||
    location.pathname === "/admin/student/";

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/student")}
      />
      {isList && (
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm shadow-sm">
            <Download size={18} />
            Export
          </button>
        </div>
      )}
      {/* Main Content Area - Rendered via Outlet from AppRoutes */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
