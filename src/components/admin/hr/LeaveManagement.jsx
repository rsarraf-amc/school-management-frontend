import { useState } from "react";
import { ClipboardCheck, CalendarDays, Settings } from "lucide-react";
import { ApplyLeaveForm, LeaveRequests, LeaveTypeList } from "./LeaveParts";

const TABS = [
  { id: "approve", label: "Approve Leave", icon: ClipboardCheck, color: "border-emerald-600 text-emerald-600", Component: LeaveRequests },
  { id: "apply", label: "Apply Leave", icon: CalendarDays, color: "border-amber-600 text-amber-600", Component: ApplyLeaveForm },
  { id: "type", label: "Leave Type", icon: Settings, color: "border-indigo-600 text-indigo-600", Component: LeaveTypeList },
];

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("approve");
  const { Component } = TABS.find((tab) => tab.id === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        {TABS.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-black uppercase tracking-widest flex items-center gap-2 border-b-2 transition-all ${activeTab === id ? color : "border-transparent text-slate-500 hover:text-slate-700"}`}
          >
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>
      <Component key={activeTab} />
    </div>
  );
};

export default LeaveManagement;
