import React, { useState } from "react";
import { ClipboardCheck, CalendarDays, Settings } from "lucide-react";
import ApproveLeave from "./ApproveLeave";
import ApplyLeave from "./ApplyLeave";
import LeaveType from "./LeaveType";

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("approve");
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
         <button onClick={() => setActiveTab("approve")} className={`px-6 py-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === "approve" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            <ClipboardCheck size={18} /> Approve Leave
         </button>
         <button onClick={() => setActiveTab("apply")} className={`px-6 py-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === "apply" ? "border-amber-600 text-amber-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            <CalendarDays size={18} /> Apply Leave
         </button>
         <button onClick={() => setActiveTab("type")} className={`px-6 py-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === "type" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            <Settings size={18} /> Leave Type
         </button>
      </div>

      {activeTab === "approve" && <ApproveLeave reloadKey={reloadKey} />}
      {activeTab === "apply" && <ApplyLeave onApplied={() => setReloadKey((k) => k + 1)} />}
      {activeTab === "type" && <LeaveType />}
    </div>
  );
};

export default LeaveManagement;
