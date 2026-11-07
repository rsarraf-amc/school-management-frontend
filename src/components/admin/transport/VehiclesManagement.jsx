import React from "react";
import { Plus, Truck, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { vehicles, drivers } from "../../../mock/transportData";

const VehiclesManagement = () => {
  const columns = [
    { header: "Vehicle No", accessor: "vehicleNo", render: (row) => <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.vehicleNo}</span> },
    { header: "Model", accessor: "vehicleModel", render: (row) => <span className="font-bold text-slate-900">{row.vehicleModel}</span> },
    { header: "Year", accessor: "yearMade", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.yearMade}</span> },
    { header: "Driver", accessor: "driverName", render: (row) => <span className="font-bold text-slate-700">{row.driverName}</span> },
    { header: "Driver Contact", accessor: "driverContact", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.driverContact}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Vehicle Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Truck size={18} className="text-emerald-600" /> Add Vehicle
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle No *</label>
                <input type="text" placeholder="e.g. UP-32-AB-1234" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle Model</label>
                <input type="text" placeholder="e.g. Tata Starbus" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Year Made</label>
                <input type="text" placeholder="e.g. 2021" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Assign Driver *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="">Select Driver</option>
                   {drivers.map(d => <option key={d.id} value={d.name}>{d.name} ({d.licenseNo})</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Note</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none"></textarea>
             </div>
             <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save Vehicle
             </button>
          </form>
        </div>
      </div>

      {/* Vehicles List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Vehicle Inventory</h3>
            </div>
            <DataTable columns={columns} data={vehicles} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default VehiclesManagement;
