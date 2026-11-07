import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  UserPlus,
  Users,
  Phone,
  MessageSquare,
  Settings,
  Send,
  Inbox,
  LayoutDashboard,
  ChevronLeft,
} from "lucide-react";

import QuickActionSectionHeader from "../../../components/common/QuickActionSectionHeader";
import FrontOfficeOverview from "../../../components/admin/front-office/FrontOfficeOverview";
import AdmissionEnquiry from "../../../components/admin/front-office/AdmissionEnquiry";
import VisitorBook from "../../../components/admin/front-office/VisitorBook";
import PhoneLog from "../../../components/admin/front-office/PhoneLog";
import PostalDispatch from "../../../components/admin/front-office/PostalDispatch";
import PostalReceive from "../../../components/admin/front-office/PostalReceive";
import Complains from "../../../components/admin/front-office/Complains";
import FrontOfficeSettings from "../../../components/admin/front-office/FrontOfficeSettings";

export default function FrontOffice() {
  const navigate = useNavigate();
  const location = useLocation();

  const isOverview =
    location.pathname === "/admin/front-office" ||
    location.pathname === "/admin/front-office/";

  const getHeaderTitle = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "admission":
        return "Admission Enquiry";
      case "visitor":
        return "Visitor Book";
      case "phone":
        return "Phone Call Log";
      case "dispatch":
        return "Postal Dispatch";
      case "receive":
        return "Postal Receive";
      case "complain":
        return "Complains";
      case "settings":
        return "Setup Settings";
      default:
        return "Front Office Hub";
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <QuickActionSectionHeader
        title={getHeaderTitle()}
        description={
          isOverview
            ? "Manage inquiries, visitors, calls, and administrative settings."
            : "Manage and track details for this section."
        }
        showBack={!isOverview}
        onBack={() => navigate("/admin/front-office")}
      />

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Routes>
          <Route index element={<FrontOfficeOverview />} />
          <Route path="admission" element={<AdmissionEnquiry />} />
          <Route path="visitor" element={<VisitorBook />} />
          <Route path="phone" element={<PhoneLog />} />
          <Route path="dispatch" element={<PostalDispatch />} />
          <Route path="receive" element={<PostalReceive />} />
          <Route path="complain" element={<Complains />} />
          <Route path="settings" element={<FrontOfficeSettings />} />
        </Routes>
      </div>
    </div>
  );
}
