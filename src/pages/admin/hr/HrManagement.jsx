import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function HrManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/add-staff"))
      return { title: "Add Staff", desc: "Onboard new employees and staff members." };
    if (path.includes("/directory"))
      return { title: "Staff Directory", desc: "Search and manage existing school staff." };
    if (path.includes("/manual-attendance"))
      return { title: "Manual Attendance", desc: "Mark daily staff attendance manually." };
    if (path.includes("/attendance-report"))
      return { title: "Attendance Report", desc: "View detailed staff attendance records." };
    if (path.includes("/payroll"))
      return { title: "Payroll Management", desc: "Process salaries and generate payslips." };
    if (path.includes("/apply-leave"))
      return { title: "Apply Leave", desc: "Submit a new leave application." };
    if (path.includes("/approve-leave"))
      return { title: "Approve Leave", desc: "Review and manage staff leave requests." };
    if (path.includes("/leave-type"))
      return { title: "Leave Type", desc: "Configure available leave categories." };
    if (path.includes("/department"))
      return { title: "Department Setup", desc: "Manage school departments." };
    if (path.includes("/designation"))
      return { title: "Designation Setup", desc: "Manage staff roles and designations." };
    if (path.includes("/shift"))
      return { title: "Shift Setup", desc: "Configure staff working hours." };

    return {
      title: "Human Resources",
      desc: "Complete personnel management, attendance, payroll, and HR configurations.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex = location.pathname === "/admin/hr" || location.pathname === "/admin/hr/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/hr")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
