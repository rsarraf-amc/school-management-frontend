import React from "react";
import { Info, Plus, Edit, Trash2, FileText } from "lucide-react";
import DataTable from "../../ui/DataTable";

const ExamInstruction = () => {
  const mockInstructions = [
    { id: 1, title: "Final Exam 2024", content: "All students must bring their own stationery." },
    { id: 2, title: "Monthly Test Rules", content: "Electronic gadgets are strictly prohibited." },
  ];

  const columns = [
    { header: "Instruction Title", accessor: "title", render: (row) => <span className="font-bold text-slate-900">{row.title}</span> },
    { header: "Content Preview", accessor: "content", render: (row) => <span className="text-slate-500 font-medium text-xs truncate max-w-xs block">{row.content}</span> },
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
             <Plus size={18} className="text-slate-600" /> Create Instruction
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Instruction Title *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Message *</label>
                <textarea rows="6" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none focus:ring-2 focus:ring-slate-500/20"></textarea>
             </div>
             <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save Instruction
             </button>
          </form>
        </div>
      </div>
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Standard Instructions</h3>
            </div>
            <DataTable columns={columns} data={mockInstructions} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default ExamInstruction;
