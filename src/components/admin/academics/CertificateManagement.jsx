import React, { useState } from "react";
import { Search, FileText, Download, Printer, User } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";

const CertificateManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const mockStudents = [
    { id: 1, name: "Aarav Sharma", admissionNo: "ADM-001", class: "10", section: "A", tcStatus: "Not Issued" },
    { id: 2, name: "Ishani Verma", admissionNo: "ADM-002", class: "10", section: "A", tcStatus: "Issued" },
  ];

  const columns = [
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="font-bold text-slate-900">{row.admissionNo}</span> },
    { header: "Student Name", accessor: "name", render: (row) => (
      <div className="flex items-center gap-2">
         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <User size={14} />
         </div>
         <span className="font-bold text-slate-700">{row.name}</span>
      </div>
    )},
    { header: "Class", render: (row) => <span className="text-slate-600 font-medium">{row.class} ({row.section})</span> },
    { header: "TC Status", accessor: "tcStatus", render: (row) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${row.tcStatus === "Issued" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
        {row.tcStatus}
      </span>
    )},
  ];

  const actions = [
    {
      icon: Printer,
      label: "Generate TC",
      onClick: (row) => alert(`Generating Transfer Certificate for ${row.name}...`),
    },
    {
      icon: Download,
      label: "Download Template",
      onClick: (row) => alert(`Downloading TC template...`),
    },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Certificate Generation" description="Search students to generate Transfer Certificates or other academic documents." onFilter={() => {}} onReset={() => setSearchTerm("")}>
        <FilterItem label="Search Student">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Admission No or Name..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-violet-500/20" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </FilterItem>
        <FilterItem label="Class">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="10">Class 10</option>
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            Student Document Portal
          </h3>
        </div>
        <DataTable columns={columns} data={mockStudents} actions={actions} />
      </div>
    </div>
  );
};

export default CertificateManagement;
