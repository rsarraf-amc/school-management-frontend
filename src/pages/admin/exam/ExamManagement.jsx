import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function ExamManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/schedule")) return { title: "Exam Schedule", desc: "Create and manage examination schedules." };
    if (path.includes("/assign-marks")) return { title: "Assign Marks", desc: "Bulk entry of student marks for exams." };
    if (path.includes("/exam-list")) return { title: "Exam List", desc: "View and manage all examination records." };
    if (path.includes("/single-result")) return { title: "Single Result", desc: "View individual student performance marksheet." };
    if (path.includes("/admit-card")) return { title: "Admit Card", desc: "Generate and print student exam admit cards." };
    if (path.includes("/marks-report")) return { title: "Marks Report", desc: "Analytical reports on examination results." };
    if (path.includes("/exam-type")) return { title: "Exam Type", desc: "Manage examination categories and types." };
    if (path.includes("/assessment")) return { title: "Assessment", desc: "Configure assessment criteria for subjects." };
    if (path.includes("/observation")) return { title: "Observation", desc: "Record non-academic traits and behaviors." };
    if (path.includes("/observation-type")) return { title: "Observation Type", desc: "Manage categories for student observations." };
    if (path.includes("/exam-grade")) return { title: "Exam Grade", desc: "Define and manage grading system rules." };
    if (path.includes("/exam-instruction")) return { title: "Exam Instruction", desc: "Manage instructions for examination papers." };

    return {
      title: "Examination Center",
      desc: "Comprehensive management of exams, marks, results, and grading systems.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex = location.pathname === "/admin/exam" || location.pathname === "/admin/exam/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/exam")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
