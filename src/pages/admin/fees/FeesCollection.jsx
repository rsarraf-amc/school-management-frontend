import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { 
  CreditCard, 
  Search, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  ChevronLeft,
  Users,
  Backpack,
  History,
  ClipboardList
} from "lucide-react";

import FeesOverview from "../../../components/admin/fees/FeesOverview";
import CollectFees from "../../../components/admin/fees/CollectFees";
import SearchFeesDue from "../../../components/admin/fees/SearchFeesDue";
import FeesMaster from "../../../components/admin/fees/FeesMaster";
import FeesGroup from "../../../components/admin/fees/FeesGroup";
import FeesType from "../../../components/admin/fees/FeesType";
import FeeCollectionDetail from "../../../components/admin/fees/FeeCollectionDetail";

export default function FeesCollection() {
  const navigate = useNavigate();
  const location = useLocation();

  const isOverview = location.pathname === "/admin/fees" || location.pathname === "/admin/fees/";

  const getHeaderTitle = () => {
    const path = location.pathname.split("/").pop();
    switch (path) {
      case "collect": return "Collect Fees";
      case "due": return "Search Fees Due";
      case "master": return "Fees Master";
      case "group": return "Fees Group";
      case "type": return "Fees Type";
      default: return "Fees Collection Hub";
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-0 opacity-50 pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          {!isOverview && (
            <button
              onClick={() => navigate("/admin/fees")}
              className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors text-slate-600"
              title="Back to Overview"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl xl:text-3xl font-black text-slate-900 tracking-tight">
              {getHeaderTitle()}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {isOverview 
                ? "Manage student fees, collections, and financial configurations." 
                : "Manage and track details for this section."}
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Routes>
          <Route index element={<FeesOverview />} />
          <Route path="collect" element={<CollectFees />} />
          <Route path="due" element={<SearchFeesDue />} />
          <Route path="master" element={<FeesMaster />} />
          <Route path="group" element={<FeesGroup />} />
          <Route path="type" element={<FeesType />} />
          <Route path="collect/:studentId" element={<FeeCollectionDetail />} />
        </Routes>
      </div>
    </div>
  );
}
