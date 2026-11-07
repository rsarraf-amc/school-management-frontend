import React from "react";
import { Download, FileText } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { admissionReports } from "../../../mock/reportsData";

const AdmissionReport = () => {
  const columns = [
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.admissionNo}</span> },
    { header: "Student Name", accessor: "studentName", render: (row) => <span className="font-bold text-slate-900">{row.studentName}</span> },
    { header: "Class", render: (row) => <span className="font-medium text-slate-600">{row.class} ({row.section})</span> },
    { header: "Gender", accessor: "gender", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.gender}</span> },
    { header: "Admission Date", accessor: "admissionDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.admissionDate}</span> },
    { header: "Status", accessor: "status", render: (row) => <span className="font-bold text-emerald-600 text-xs">{row.status}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Admission Report" 
         description="Generate reports on new student enrollments."
         onFilter={() => {}} 
         onReset={() => {}}
      >
        <FilterItem label="Class">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Classes</option>
              <option value="10">Class 10</option>
           </select>
        </FilterItem>
        <FilterItem label="Gender">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
           </select>
        </FilterItem>
        <FilterItem label="From Date">
          <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
        </FilterItem>
        <FilterItem label="To Date">
          <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-indigo-600" />
            Admissions Data
          </h3>
          <div className="flex gap-2">
             <button className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2">
               <Download size={18} /> CSV
             </button>
             <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center gap-2">
               <Download size={18} /> Export PDF
             </button>
          </div>
        </div>
        <DataTable columns={columns} data={admissionReports} />
      </div>
    </div>
  );
};

export default AdmissionReport;
