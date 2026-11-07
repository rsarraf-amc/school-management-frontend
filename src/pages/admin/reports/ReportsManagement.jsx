import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function ReportsManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/admissions"))
      return { title: "Admission Report", desc: "View detailed statistics on student enrollments." };
    if (path.includes("/transactions"))
      return { title: "Transaction Reports", desc: "Track income and expense ledgers." };
    if (path.includes("/fees"))
      return { title: "Fees Report", desc: "Analyze student fee collections and dues." };
    if (path.includes("/payroll"))
      return { title: "Payroll Reports", desc: "Review staff salary disbursements." };

    return {
      title: "Report Center",
      desc: "Comprehensive analytics and reporting for school administration.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex = location.pathname === "/admin/reports" || location.pathname === "/admin/reports/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/reports")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
