import React, { useState } from "react";
import { ArrowUpCircle, Search, AlertCircle, Save } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { promotionData } from "../../../mock/academicsData";

const PromoteStudents = () => {
  const [filters, setFilters] = useState({ class: "", section: "", toClass: "", toSection: "" });
  const [students, setStudents] = useState(promotionData);

  const columns = [
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="font-bold text-slate-900">{row.admissionNo}</span> },
    { header: "Student Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Current Result", accessor: "result", render: (row) => (
      <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={row.result}>
        <option value="Pass">Pass</option>
        <option value="Fail">Fail</option>
      </select>
    )},
    { header: "Next Status", accessor: "status", render: (row) => (
      <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" value={row.status}>
        <option value="Continue">Continue</option>
        <option value="Leave">Leave</option>
      </select>
    )},
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Promotion Criteria" description="Select current and target class-sections for promotion." onFilter={() => {}} onReset={() => {}}>
        <FilterItem label="Current Class *">
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
            <option value="">Select Class</option>
            <option value="10">Class 10</option>
          </select>
        </FilterItem>
        <FilterItem label="Target Class *">
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
            <option value="">Select Next Class</option>
            <option value="11">Class 11</option>
          </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800">
         <AlertCircle size={20} className="shrink-0" />
         <p className="text-sm font-medium">Bulk promotion will update student records for the next academic session. Ensure results are finalized before proceeding.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Student Progression List</h3>
          <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2" onClick={() => alert("Students promoted successfully!")}>
            <ArrowUpCircle size={18} /> Promote Students
          </button>
        </div>
        <DataTable columns={columns} data={students} />
      </div>
    </div>
  );
};

export default PromoteStudents;
