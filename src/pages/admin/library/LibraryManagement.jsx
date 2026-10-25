import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function LibraryManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/add-book"))
      return { title: "Add Book", desc: "Register a new book into the library inventory." };
    if (path.includes("/book-list"))
      return { title: "Book List", desc: "View and manage the complete library book inventory." };
    if (path.includes("/issue-return"))
      return { title: "Issue / Return", desc: "Process book issues, returns, and track overdue items." };
    if (path.includes("/add-student"))
      return { title: "Library Members", desc: "Register new students and staff as library members." };
    if (path.includes("/category"))
      return { title: "Book Categories", desc: "Manage subject categories and book classifications." };
    if (path.includes("/monthly-report"))
      return { title: "Library Report", desc: "View monthly circulation and inventory statistics." };

    return {
      title: "Library Management",
      desc: "Comprehensive system for managing books, members, and circulation.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex = location.pathname === "/admin/library" || location.pathname === "/admin/library/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/library")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
