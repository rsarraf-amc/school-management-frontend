import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function CommunicateManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/notice-board"))
      return { title: "Notice Board", desc: "Publish and manage school-wide announcements." };
    if (path.includes("/sms"))
      return { title: "Send SMS", desc: "Compose and dispatch bulk SMS messages." };

    return {
      title: "Communication Center",
      desc: "Manage school-wide notices and SMS communications.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex = location.pathname === "/admin/communicate" || location.pathname === "/admin/communicate/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/communicate")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
