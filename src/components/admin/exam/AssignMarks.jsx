import React from "react";
import { Edit3, Save, Search } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import DataTable from "../../ui/DataTable";

const AssignMarks = () => {
  const mockStudents = [
    { id: 1, admissionNo: "1001", name: "Aarav Sharma", marks: "" },
    { id: 2, admissionNo: "1002", name: "Ishani Verma", marks: "" },
  ];

  const columns = [
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.admissionNo}</span> },
    { header: "Student Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { 
      header: "Marks (Max: 100)", 
      accessor: "marks", 
      render: (row) => (
        <input type="number" placeholder="Enter marks" className="w-32 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" />
      ) 
    },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Marks Entry" description="Select criteria to assign marks to students." onFilter={() => {}} onReset={() => {}}>
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
        <FilterItem label="Subject">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium">
              <option>Mathematics</option>
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Edit3 size={18} className="text-emerald-600" /> Enter Student Marks
          </h3>
          <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2">
            <Save size={18} /> Save Marks
          </button>
        </div>
        <DataTable columns={columns} data={mockStudents} />
      </div>
    </div>
  );
};

export default AssignMarks;
