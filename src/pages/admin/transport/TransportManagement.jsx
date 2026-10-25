import { Outlet, useNavigate, useLocation } from "react-router-dom";
import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";

export default function TransportManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const getHeaderInfo = () => {
    const path = location.pathname;

    if (path.includes("/routes"))
      return { title: "Routes", desc: "Manage transport routes and fare details." };
    if (path.includes("/vehicles"))
      return { title: "Vehicles", desc: "Manage school fleet and vehicle inventory." };
    if (path.includes("/assign-vehicles"))
      return { title: "Assign Vehicles", desc: "Map vehicles and drivers to specific routes." };
    if (path.includes("/report"))
      return { title: "Transport Report", desc: "View detailed transport utilization and assignments." };
    if (path.includes("/assign-student"))
      return { title: "Assign Student", desc: "Allocate students to transport routes and stoppages." };
    if (path.includes("/drivers"))
      return { title: "Add Driver", desc: "Register and manage transport staff." };
    if (path.includes("/timetable"))
      return { title: "Route TimeTable", desc: "Schedule vehicle arrivals and departures." };
    if (path.includes("/stoppage"))
      return { title: "Stoppage", desc: "Manage pick-up and drop-off points along routes." };

    return {
      title: "Transport Management",
      desc: "Comprehensive system for managing school transport, vehicles, and route assignments.",
    };
  };

  const { title, desc } = getHeaderInfo();
  const isIndex = location.pathname === "/admin/transport" || location.pathname === "/admin/transport/";

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={title}
        description={desc}
        showBack={!isIndex}
        onBack={() => navigate("/admin/transport")}
      />
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Outlet />
      </div>
    </div>
  );
}
