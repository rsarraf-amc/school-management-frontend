import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function ExpenseManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/add"))
      return {
        title: "Add Expense",
        desc: "Record a new expenditure into the system.",
      };
    if (path.includes("/search"))
      return {
        title: "Search Expense",
        desc: "Search and filter through historical expenses.",
      };
    if (path.includes("/expense-head"))
      return {
        title: "Expense Head",
        desc: "Manage and categorize different expense types.",
      };

    return {
      title: "Expense Management",
      desc: "Complete oversight of institutional expenditures and financial outflows.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isSearch = location.pathname.includes("/search");
  const isIndex =
    location.pathname === "/admin/expense" ||
    location.pathname === "/admin/expense/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/expense")}
      />
      {isSearch && (
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all text-sm shadow-sm">
            <Download size={18} />
            Export Report
          </button>
        </div>
      )}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
