import { useState } from "react";
import { Building, Briefcase, Clock } from "lucide-react";
import DepartmentManagement from "./DepartmentManagement";
import DesignationManagement from "./DesignationManagement";
import ShiftManagement from "./ShiftManagement";

const TABS = [
  { id: "department", label: "Department", icon: Building, Component: DepartmentManagement },
  { id: "designation", label: "Designation", icon: Briefcase, Component: DesignationManagement },
  { id: "shift", label: "Shift Setup", icon: Clock, Component: ShiftManagement },
];

const HrSetup = () => {
  const [activeTab, setActiveTab] = useState("department");
  const { Component } = TABS.find((tab) => tab.id === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === id ? "border-slate-800 text-slate-800" : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>
      <Component />
    </div>
  );
};

export default HrSetup;
