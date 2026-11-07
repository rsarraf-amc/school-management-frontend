import React from "react";
import { GitBranch, Plus, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { subCategories, categories } from "../../../mock/storeData";

const SubCategoryManagement = () => {
  const columns = [
    { header: "Sub Category", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Main Category", accessor: "category", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.category}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Plus size={18} className="text-slate-600" /> Create Sub-Category
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Main Category *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Sub-Category Name *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
             </div>
             <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save Sub-Category
             </button>
          </form>
        </div>
      </div>
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Sub-Categories</h3>
            </div>
            <DataTable columns={columns} data={subCategories} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default SubCategoryManagement;
