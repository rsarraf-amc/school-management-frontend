import React from "react";
import { Plus, Briefcase } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { designations } from "../../../mock/hrData";

const DesignationManagement = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
           <h3 className="font-black text-slate-900 tracking-tight">Designations</h3>
         </div>
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
};

export default DesignationManagement;
