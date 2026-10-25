import React from "react";
import { Plus } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { leaveTypes } from "../../../mock/hrData";

const LeaveType = () => {
  const columns = [
    { header: "Leave Type Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
           <h3 className="font-black text-slate-900 tracking-tight">Leave Types</h3>
         </div>
         <DataTable columns={columns} data={leaveTypes} />
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
  );
};

export default LeaveType;
