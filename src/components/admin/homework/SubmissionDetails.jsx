import React, { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { submissionsData } from "../../../mock/homeworkData";

const SubmissionDetails = () => {
  const [records, setRecords] = useState(submissionsData);

  const updateStatus = (id, newStatus) => {
    setRecords(prev => prev.map(rec => rec.id === id ? { ...rec, status: newStatus } : rec));
  };

  const columns = [
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="font-bold text-slate-900">{row.admissionNo}</span> },
    { header: "Student Name", accessor: "studentName", render: (row) => <span className="font-bold text-slate-700">{row.studentName}</span> },
    {
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          {["Pending", "Submitted", "Evaluated"].map((status) => (
            <label key={status} className="flex items-center gap-1 cursor-pointer group">
              <input
                type="radio"
                name={`status-${row.id}`}
                checked={row.status === status}
                onChange={() => updateStatus(row.id, status)}
                className="hidden"
              />
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                row.status === status 
                  ? status === "Evaluated" ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100" 
                  : status === "Submitted" ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-100"
                  : "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-100"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
              }`}>
                {status}
              </span>
            </label>
          ))}
        </div>
      )
    },
    {
      header: "Evaluation Note",
      render: (row) => (
        <input
          type="text"
          placeholder="Teacher's remark..."
          defaultValue={row.evaluationNotes}
          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20"
        />
      )
    },
    {
      header: "Marks",
      render: (row) => (
        <input
          type="text"
          placeholder="e.g. 8/10"
          defaultValue={row.marks}
          className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500/20"
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Evaluate Submissions" 
         description="Filter by Class, Section and Subject to evaluate pending homework."
         onFilter={() => {}} 
         onReset={() => {}}
      >
        <FilterItem label="Class *">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="10">Class 10</option>
           </select>
        </FilterItem>
        <FilterItem label="Section *">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="A">Section A</option>
           </select>
        </FilterItem>
        <FilterItem label="Subject Group *">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="Science">Science</option>
           </select>
        </FilterItem>
        <FilterItem label="Subject *">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="Physics">Physics</option>
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600" />
            Student Submissions
          </h3>
          <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2">
            <Save size={18} /> Save Evaluation
          </button>
        </div>
        <DataTable columns={columns} data={records} />
      </div>
    </div>
  );
};

export default SubmissionDetails;
