import React from "react";
import { Plus, Clock } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { shifts } from "../../../mock/hrData";

const ShiftManagement = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
           <h3 className="font-black text-slate-900 tracking-tight">Shift Setup</h3>
         </div>
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
};

export default ShiftManagement;
