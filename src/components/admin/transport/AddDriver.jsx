import React from "react";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { drivers } from "../../../mock/transportData";

const AddDriver = () => {
  const columns = [
    { header: "Driver Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "License No", accessor: "licenseNo", render: (row) => <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.licenseNo}</span> },
    { header: "Phone", accessor: "phone", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.phone}</span> },
    { header: "Address", accessor: "address", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.address}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Driver Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Users size={18} className="text-rose-600" /> Add Driver
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Driver Name *</label>
                <input type="text" placeholder="e.g. Ramesh Singh" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">License No *</label>
                <input type="text" placeholder="e.g. DL-12345678" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone *</label>
                <input type="text" placeholder="e.g. 9876543210" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Address</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none focus:ring-2 focus:ring-rose-500/20"></textarea>
             </div>
             <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-100 flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save Driver
             </button>
          </form>
        </div>
      </div>

      {/* Drivers List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Driver Registry</h3>
            </div>
            <DataTable columns={columns} data={drivers} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default AddDriver;
