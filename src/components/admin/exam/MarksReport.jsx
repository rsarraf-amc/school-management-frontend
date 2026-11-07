import React from "react";
import { BarChart2, Download, Filter } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import DataTable from "../../ui/DataTable";

const MarksReport = () => {
  const mockReport = [
    { id: 1, admissionNo: "1001", name: "Aarav Sharma", maths: 85, science: 78, english: 92, total: 255, percentage: "85%", result: "Pass" },
    { id: 2, admissionNo: "1002", name: "Ishani Verma", maths: 72, science: 81, english: 88, total: 241, percentage: "80%", result: "Pass" },
  ];

  const columns = [
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="font-black text-slate-500 text-[10px]">{row.admissionNo}</span> },
    { header: "Student Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Maths", accessor: "maths", render: (row) => <span className="text-slate-500 font-medium">{row.maths}</span> },
    { header: "Science", accessor: "science", render: (row) => <span className="text-slate-500 font-medium">{row.science}</span> },
    { header: "English", accessor: "english", render: (row) => <span className="text-slate-500 font-medium">{row.english}</span> },
    { header: "Total", accessor: "total", render: (row) => <span className="font-bold text-indigo-600">{row.total}</span> },
    { header: "Percentage", accessor: "percentage", render: (row) => <span className="font-bold text-emerald-600">{row.percentage}</span> },
    { header: "Result", accessor: "result", render: (row) => <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-black uppercase tracking-widest">{row.result}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Marks Analysis Report" description="Select criteria to view class-wise performance reports." onFilter={() => {}} onReset={() => {}}>
        <FilterItem label="Exam">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium">
              <option>Half Yearly Examination</option>
           </select>
        </FilterItem>
        <FilterItem label="Class">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium">
              <option>10</option>
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/10">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart2 size={18} className="text-amber-600" /> Performance Report Data
          </h3>
          <button className="px-6 py-2.5 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm shadow-lg shadow-amber-100 flex items-center gap-2">
            <Download size={18} /> Export Excel
          </button>
        </div>
        <DataTable columns={columns} data={mockReport} />
      </div>
    </div>
  );
};

export default MarksReport;
