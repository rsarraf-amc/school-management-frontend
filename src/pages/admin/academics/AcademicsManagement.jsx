import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function AcademicsManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/subjects"))
      return {
        title: "Subject Management",
        desc: "Define and manage the school curriculum and subjects.",
      };
    if (path.includes("/class-sections"))
      return {
        title: "Classes & Sections",
        desc: "Configure the structural organization of class levels and sections.",
      };
    if (path.includes("/assign-subjects"))
      return {
        title: "Assign Subjects",
        desc: "Map subjects and teachers to specific class sections.",
      };
    if (path.includes("/promote"))
      return {
        title: "Promote Students",
        desc: "Process student progression to the next academic session.",
      };
    if (path.includes("/timetable"))
      return {
        title: "TimeTable Management",
        desc: "Design and manage schedules for classes and teachers.",
      };
    if (path.includes("/holidays"))
      return {
        title: "Holiday Management",
        desc: "Configure the school academic calendar and holidays.",
      };
    if (path.includes("/certificates"))
      return {
        title: "Transfer Certificate",
        desc: "Generate and manage student leaving certificates.",
      };

    return {
      title: "Academics Management",
      desc: "Comprehensive tools for managing school curriculum, scheduling, and student progression.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex =
    location.pathname === "/admin/academics" ||
    location.pathname === "/admin/academics/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/academics")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
