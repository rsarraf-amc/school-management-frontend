import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function AttendanceManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/manual"))
      return {
        title: "Student Attendance",
        desc: "Mark and manage daily attendance for students manually.",
      };
    if (path.includes("/daily"))
      return {
        title: "Daily Attendance",
        desc: "Review overall attendance status for a specific date.",
      };
    if (path.includes("/report"))
      return {
        title: "Attendance Report",
        desc: "Generate and analyze monthly or yearly attendance metrics.",
      };

    return {
      title: "Attendance Management",
      desc: "Complete system for tracking student presence and absenteeism.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex =
    location.pathname === "/admin/attendance" ||
    location.pathname === "/admin/attendance/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/attendance")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
