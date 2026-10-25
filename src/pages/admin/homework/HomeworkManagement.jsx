import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function HomeworkManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/add"))
      return { title: "Add Homework", desc: "Create new homework assignments for classes." };
    if (path.includes("/submissions"))
      return { title: "Submission Details", desc: "Evaluate and track student homework submissions." };

    return {
      title: "Homework Management",
      desc: "Manage class assignments, track submissions, and evaluate student work.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex = location.pathname === "/admin/homework" || location.pathname === "/admin/homework/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/homework")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
