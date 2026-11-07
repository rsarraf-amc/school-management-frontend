import React from "react";
import { Plus, Link, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { assignedVehicles, routes, vehicles } from "../../../mock/transportData";

const AssignVehicles = () => {
  const columns = [
    { header: "Route", accessor: "route", render: (row) => <span className="font-bold text-slate-900">{row.route}</span> },
    { header: "Vehicle", accessor: "vehicle", render: (row) => <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.vehicle}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Assign Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Link size={18} className="text-blue-600" /> Assign Vehicle to Route
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Route *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="">Select Route</option>
                   {routes.map(r => <option key={r.id} value={r.routeTitle}>{r.routeTitle}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="">Select Vehicle</option>
                   {vehicles.map(v => <option key={v.id} value={v.vehicleNo}>{v.vehicleNo} ({v.vehicleModel})</option>)}
                </select>
             </div>
             <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save Assignment
             </button>
          </form>
        </div>
      </div>

      {/* Assignments List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Assigned Vehicles List</h3>
            </div>
            <DataTable columns={columns} data={assignedVehicles} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default AssignVehicles;
