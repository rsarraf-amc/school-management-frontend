import { useState, useRef, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  LogOut,
  User,
  Settings,
  Calendar,
  ChevronDown,
  LayoutDashboard,
  ClipboardCheck,
  BookOpen,
  PencilLine,
  Library,
  FileBarChart,
  Mail,
  ClipboardList,
  Bell,
  Search,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

export default function TeacherLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user || user.role !== "teacher") {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
    { icon: ClipboardCheck, label: "Attendance", path: "/teacher/attendance" },
    { icon: BookOpen, label: "My Classes", path: "/teacher/classes" },
    { icon: PencilLine, label: "Homework", path: "/teacher/homework" },
    { icon: ClipboardList, label: "Exams", path: "/teacher/exams" },
    { icon: Library, label: "Library", path: "/teacher/library" },
    { icon: FileBarChart, label: "Reports", path: "/teacher/reports" },
    { icon: Mail, label: "Communication", path: "/teacher/communicate" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-72 bg-[#1e1b4b] text-slate-300 flex flex-col shadow-2xl h-screen transition-transform duration-300 ease-in-out no-scrollbar overflow-y-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <GraduationCap size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-tight">EduSmart</span>
              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Faculty Portal</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-white/5 rounded-xl md:hidden text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={location.pathname.startsWith(item.path) || (item.label === "Dashboard" && location.pathname === "/teacher")}
              onClick={() => navigate(item.path)}
              colorClass="bg-violet-600 shadow-violet-500/20"
              hoverClass="hover:bg-white/5"
              iconHoverClass="group-hover:text-violet-400"
            />
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="px-4 py-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 group hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-indigo-900 group-hover:ring-violet-500/50 transition-all">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors uppercase tracking-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                Lead Educator
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-200/60 px-4 md:px-8 py-4 flex justify-between items-center h-20">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-slate-100 text-slate-600 rounded-xl md:hidden hover:bg-slate-200 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl w-full max-w-md border border-slate-200/50 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search resources, students..."
                className="bg-transparent border-none outline-none text-sm text-slate-600 w-full font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden xl:flex items-center gap-2 text-violet-600 bg-violet-50/50 border border-violet-100 px-3 py-1.5 rounded-full">
              <Calendar size={14} className="stroke-[2.5]" />
              <span className="text-[11px] font-black uppercase tracking-wider">
                Current Term: Spring 2025
              </span>
            </div>

            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-violet-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 md:gap-3 p-1 hover:bg-slate-50 rounded-2xl transition-all duration-200 ring-1 ring-slate-200 group"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-base md:text-lg border border-violet-100 shadow-inner group-hover:scale-95 transition-transform">
                  <User size={18} />
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 mr-1 md:mr-2 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-violet-500" : ""
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 origin-top-right">
                  <div className="px-4 py-4 border-b border-slate-50 mb-2">
                    <p className="text-sm font-black text-slate-900 uppercase">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {user.email || "teacher@edusmart.com"}
                    </p>
                  </div>

                  <DropdownItem icon={User} label="Profile" />
                  <DropdownItem icon={Settings} label="Preferences" />
                  <div className="my-2 border-t border-slate-50"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold group"
                  >
                    <div className="p-2 bg-rose-100/50 rounded-xl group-hover:bg-rose-100 transition-colors">
                      <LogOut size={18} />
                    </div>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-[1920px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function SidebarItem({ icon: Icon, label, active, onClick, colorClass, hoverClass, iconHoverClass }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group
      ${active
          ? `${colorClass} text-white shadow-lg`
          : `text-slate-400 ${hoverClass} hover:text-white`
        }`}
    >
      <Icon
        size={20}
        className={`${active ? "text-white" : `text-slate-500 ${iconHoverClass}`} transition-colors`}
      />
      <span className="tracking-tight">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
    </button>
  );
}

// eslint-disable-next-line no-unused-vars
function DropdownItem({ icon: Icon, label }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-violet-600 rounded-2xl transition-all font-bold group">
      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-violet-50 transition-colors">
        <Icon size={18} />
      </div>
      <span>{label}</span>
    </button>
  );
}
