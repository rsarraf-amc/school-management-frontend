import React, { useState } from "react";
import { StaffMarkPanel, StaffReportPanel } from "./StaffAttendanceParts";

const StaffAttendance = () => {
  const [activeTab, setActiveTab] = useState("manual");
  const tab = (key) => `px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === key ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1 bg-slate-100 w-fit rounded-2xl border border-slate-200">
        <button onClick={() => setActiveTab("manual")} className={tab("manual")}>Manual Attendance</button>
        <button onClick={() => setActiveTab("report")} className={tab("report")}>Attendance Report</button>
      </div>
      {activeTab === "manual" ? <StaffMarkPanel /> : <StaffReportPanel />}
    </div>
  );
};

export default StaffAttendance;
