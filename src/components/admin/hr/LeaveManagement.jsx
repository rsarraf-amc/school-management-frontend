import React, { useState } from "react";
import { Plus, Check, X, ClipboardCheck, CalendarDays, Settings } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { leaveRequests, leaveTypes } from "../../../mock/hrData";

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState("approve");

  const reqColumns = [
    { header: "Staff", accessor: "staff", render: (row) => <span className="font-bold text-slate-900">{row.staff}</span> },
    { header: "Leave Type", accessor: "type", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.type}</span> },
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Days", accessor: "days", render: (row) => <span className="font-bold text-slate-700">{row.days}</span> },
    { header: "Apply Date", accessor: "applyDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.applyDate}</span> },
    { header: "Status", accessor: "status", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
          row.status === "Pending" ? "bg-amber-50 text-amber-600" :
          "bg-rose-50 text-rose-600"
       }`}>
          {row.status}
       </span>
    )},
  ];

  const typeColumns = [
    { header: "Leave Type Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
  ];

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

      {activeTab === "approve" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
          <DataTable columns={reqColumns} data={leaveRequests} actions={[
             { icon: Check, label: "Approve", onClick: () => {} },
             { icon: X, label: "Disapprove", onClick: () => {} }
          ]} />
        </div>
      )}

      {activeTab === "apply" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 max-w-3xl animate-in fade-in">
           <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Leave Type *</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                       {leaveTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Staff *</label>
                    <input type="text" placeholder="Select Staff..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Apply Date *</label>
                    <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">From *</label>
                       <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">To *</label>
                       <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
                    </div>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Reason</label>
                 <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none"></textarea>
              </div>
              <button type="submit" className="py-4 px-8 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm shadow-lg shadow-amber-100 flex items-center gap-2">
                 <Plus size={18} /> Submit Application
              </button>
           </form>
        </div>
      )}

      {activeTab === "type" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
             <DataTable columns={typeColumns} data={leaveTypes} />
          </div>
          <div className="lg:col-span-1">
             <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
                <h3 className="font-black text-slate-900 tracking-tight mb-4">Add Leave Type</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Name *</label>
                      <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                      <Plus size={18} /> Save Leave Type
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
