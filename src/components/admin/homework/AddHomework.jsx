import React from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { homeworkList } from "../../../mock/homeworkData";

const AddHomework = () => {
  const columns = [
    { header: "Class", render: (row) => <span className="font-bold text-slate-900">{row.class} ({row.section})</span> },
    { header: "Subject Group", accessor: "subjectGroup", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.subjectGroup}</span> },
    { header: "Subject", accessor: "subject", render: (row) => <span className="font-bold text-slate-700">{row.subject}</span> },
    { header: "Homework Date", accessor: "homeworkDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.homeworkDate}</span> },
    { header: "Submission Date", accessor: "submissionDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.submissionDate}</span> },
    { header: "Status", accessor: "status", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === "Evaluated" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
       }`}>
          {row.status}
       </span>
    )},
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Add Homework Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Plus size={18} className="text-indigo-600" /> Add Homework
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Class *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="10">Class 10</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Section *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="A">A</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject Group *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="Science">Science</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="Physics">Physics</option>
                </select>
             </div>
             <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Homework Date *</label>
                   <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Submission Date *</label>
                   <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Attach Document</label>
                <input type="file" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none"></textarea>
             </div>
             <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save Homework
             </button>
          </form>
        </div>
      </div>

      {/* Homework List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Homework List</h3>
            </div>
            <DataTable columns={columns} data={homeworkList} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default AddHomework;
