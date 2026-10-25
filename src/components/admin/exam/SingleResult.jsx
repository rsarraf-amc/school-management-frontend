import React from "react";
import { Eye, Search, Printer, Download } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import DataTable from "../../ui/DataTable";

const SingleResult = () => {
  const mockResult = [
    { id: 1, subject: "Mathematics", maxMarks: 100, minMarks: 33, marksObtained: 85, grade: "A" },
    { id: 2, subject: "Science", maxMarks: 100, minMarks: 33, marksObtained: 78, grade: "B" },
    { id: 3, subject: "English", maxMarks: 100, minMarks: 33, marksObtained: 92, grade: "A+" },
  ];

  const columns = [
    { header: "Subject", accessor: "subject", render: (row) => <span className="font-bold text-slate-900">{row.subject}</span> },
    { header: "Max Marks", accessor: "maxMarks", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.maxMarks}</span> },
    { header: "Min Marks", accessor: "minMarks", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.minMarks}</span> },
    { header: "Obtained", accessor: "marksObtained", render: (row) => <span className="font-bold text-indigo-600">{row.marksObtained}</span> },
    { header: "Grade", accessor: "grade", render: (row) => <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.grade}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="View Result" description="Search for an individual student to view their marksheet." onFilter={() => {}} onReset={() => {}}>
        <FilterItem label="Admission No">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Enter Admission No..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
           </div>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-violet-50/10">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Eye size={32} />
             </div>
             <div>
                <h3 className="font-black text-slate-900 tracking-tight text-xl">Aarav Sharma</h3>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Class 10 - Section A (2024-25)</p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm"><Printer size={20} /></button>
             <button className="px-6 py-2.5 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all text-sm shadow-lg shadow-violet-100 flex items-center gap-2">
               <Download size={18} /> Marksheet
             </button>
          </div>
        </div>
        <DataTable columns={columns} data={mockResult} />
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <div className="flex gap-8">
              <div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Marks</span>
                 <p className="text-xl font-black text-slate-900">255 / 300</p>
              </div>
              <div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentage</span>
                 <p className="text-xl font-black text-emerald-600">85%</p>
              </div>
           </div>
           <div className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-2xl font-black text-sm uppercase tracking-widest">
              Pass
           </div>
        </div>
      </div>
    </div>
  );
};

export default SingleResult;
