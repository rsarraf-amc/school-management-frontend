import React, { useState } from "react";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { subjects } from "../../../mock/academicsData";

const SubjectManagement = () => {
  const [subjectList, setSubjectList] = useState(subjects);
  const [formData, setFormData] = useState({ name: "", code: "", type: "Theory" });

  const handleAdd = (e) => {
    e.preventDefault();
    setSubjectList([...subjectList, { ...formData, id: Date.now() }]);
    setFormData({ name: "", code: "", type: "Theory" });
  };

  const columns = [
    { header: "Subject Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Subject Code", accessor: "code", render: (row) => <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{row.code}</span> },
    { header: "Type", accessor: "type", render: (row) => <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${row.type === "Theory" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-indigo-50 text-indigo-600 border border-indigo-100"}`}>{row.type}</span> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Subject List</h3>
          </div>
          <DataTable columns={columns} data={subjectList} />
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-600" />
              Add Subject
            </h3>
          </div>
          <form onSubmit={handleAdd} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject Name *</label>
              <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject Code</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject Type</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none focus:ring-2 focus:ring-emerald-500/20" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
                <option value="Theory/Practical">Theory/Practical</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4">
              <Plus size={18} /> Add Subject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubjectManagement;
