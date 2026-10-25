import React from "react";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { stoppages } from "../../../mock/transportData";

const StoppageManagement = () => {
  const columns = [
    { header: "Stoppage Name", accessor: "stoppageName", render: (row) => <span className="font-bold text-slate-900">{row.stoppageName}</span> },
    { header: "Fare Amount (₹)", accessor: "fareAmount", render: (row) => <span className="font-medium text-emerald-600">₹{row.fareAmount}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Stoppage Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <MapPin size={18} className="text-slate-600" /> Create Stoppage
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Stoppage Name *</label>
                <input type="text" placeholder="e.g. Central Market" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Fare Amount (₹) *</label>
                <input type="number" placeholder="e.g. 500" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
             </div>
             <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save Stoppage
             </button>
          </form>
        </div>
      </div>

      {/* Stoppages List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Active Stoppages</h3>
            </div>
            <DataTable columns={columns} data={stoppages} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default StoppageManagement;
