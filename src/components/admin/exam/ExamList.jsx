import React from "react";
import { List, Eye, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { exams } from "../../../mock/examData";

const ExamList = () => {
  const columns = [
    { header: "Exam Name", accessor: "title", render: (row) => <span className="font-bold text-slate-900">{row.title}</span> },
    { header: "Type", accessor: "type", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.type}</span> },
    { header: "Session", accessor: "session", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.session}</span> },
    { header: "Status", accessor: "status", render: (row) => <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${row.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>{row.status}</span> },
  ];

  const actions = [
    { icon: Eye, label: "View Results", onClick: () => {} },
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <h3 className="font-black text-slate-900 tracking-tight">Examination Registry</h3>
      </div>
      <DataTable columns={columns} data={exams} actions={actions} />
    </div>
  );
};

export default ExamList;
