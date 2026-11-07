import React from "react";
import { Plus, Calendar, Save } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { exams, examTypes } from "../../../mock/examData";

const ExamSchedule = () => {
  const columns = [
    { header: "Exam Title", accessor: "title", render: (row) => <span className="font-bold text-slate-900">{row.title}</span> },
    { header: "Type", accessor: "type", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.type}</span> },
    { header: "Session", accessor: "session", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.session}</span> },
    { header: "Status", accessor: "status", render: (row) => <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${row.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{row.status}</span> },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Plus size={18} className="text-indigo-600" /> Schedule Exam
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Exam Title *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Exam Type *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   {examTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Session *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option>2024-25</option>
                </select>
             </div>
             <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4">
                <Save size={18} /> Save Exam
             </button>
          </form>
        </div>
      </div>
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Scheduled Exams</h3>
            </div>
            <DataTable columns={columns} data={exams} />
         </div>
      </div>
    </div>
  );
};

export default ExamSchedule;
