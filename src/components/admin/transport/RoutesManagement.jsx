import React from "react";
import { Plus, Map, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { routes } from "../../../mock/transportData";

const RoutesManagement = () => {
  const columns = [
    { header: "Route Title", accessor: "routeTitle", render: (row) => <span className="font-bold text-slate-900">{row.routeTitle}</span> },
    { header: "Base Fare (₹)", accessor: "routeFare", render: (row) => <span className="font-medium text-emerald-600">₹{row.routeFare}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Route Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Map size={18} className="text-indigo-600" /> Create Route
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Route Title *</label>
                <input type="text" placeholder="e.g. City Center via Main St" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Base Fare (₹) *</label>
                <input type="number" placeholder="e.g. 1500" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
             </div>
             <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save Route
             </button>
          </form>
        </div>
      </div>

      {/* Routes List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Active Routes</h3>
            </div>
            <DataTable columns={columns} data={routes} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default RoutesManagement;
