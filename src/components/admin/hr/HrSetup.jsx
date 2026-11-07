import React, { useState } from "react";
import { Building, Briefcase, Clock } from "lucide-react";
import DepartmentManagement from "./DepartmentManagement";
import DesignationManagement from "./DesignationManagement";
import ShiftManagement from "./ShiftManagement";

const HrSetup = () => {
  const [activeTab, setActiveTab] = useState("department");

  const renderContent = () => {
    switch (activeTab) {
      case "department":
        return <DepartmentManagement />;
      case "designation":
        return <DesignationManagement />;
      case "shift":
        return <ShiftManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
         <button onClick={() => setActiveTab("department")} className={`px-6 py-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === "department" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            <Building size={18} /> Department
         </button>
         <button onClick={() => setActiveTab("designation")} className={`px-6 py-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === "designation" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            <Briefcase size={18} /> Designation
         </button>
         <button onClick={() => setActiveTab("shift")} className={`px-6 py-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === "shift" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            <Clock size={18} /> Shift Setup
         </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default HrSetup;
