import React, { useState } from "react";
import { Building, Briefcase, Clock, Plus } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { departments, designations, shifts } from "../../../mock/hrData";

const HrSetup = () => {
  const [activeTab, setActiveTab] = useState("department");

  const renderContent = () => {
    switch (activeTab) {
      case "department":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
               <DataTable columns={[{ header: "Department Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> }]} data={departments} />
            </div>
            <div className="lg:col-span-1">
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
                  <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4"><Building size={18} className="text-slate-600"/> Add Department</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Name *</label>
                        <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
                     </div>
                     <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2"><Plus size={18} /> Save</button>
                  </form>
               </div>
            </div>
          </div>
        );
      case "designation":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
               <DataTable columns={[{ header: "Designation Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> }]} data={designations} />
            </div>
            <div className="lg:col-span-1">
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
                  <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4"><Briefcase size={18} className="text-slate-600"/> Add Designation</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Name *</label>
                        <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
                     </div>
                     <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2"><Plus size={18} /> Save</button>
                  </form>
               </div>
            </div>
          </div>
        );
      case "shift":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
               <DataTable columns={[
                  { header: "Shift Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
                  { header: "Time From", accessor: "timeFrom", render: (row) => <span className="text-slate-500 font-medium">{row.timeFrom}</span> },
                  { header: "Time To", accessor: "timeTo", render: (row) => <span className="text-slate-500 font-medium">{row.timeTo}</span> }
               ]} data={shifts} />
            </div>
            <div className="lg:col-span-1">
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
                  <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4"><Clock size={18} className="text-slate-600"/> Add Shift</h3>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Name *</label>
                        <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Time From</label>
                           <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Time To</label>
                           <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
                        </div>
                     </div>
                     <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2"><Plus size={18} /> Save</button>
                  </form>
               </div>
            </div>
          </div>
        );
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
