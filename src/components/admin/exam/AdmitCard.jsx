import React from "react";
import { CreditCard, Download, Printer } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import DataTable from "../../ui/DataTable";

const AdmitCard = () => {
  const mockAdmitCards = [
    { id: 1, admissionNo: "1001", name: "Aarav Sharma", rollNo: "101", class: "10 (A)" },
    { id: 2, admissionNo: "1002", name: "Ishani Verma", rollNo: "102", class: "10 (A)" },
  ];

  const columns = [
    { header: "Roll No", accessor: "rollNo", render: (row) => <span className="font-black text-slate-900">{row.rollNo}</span> },
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.admissionNo}</span> },
    { header: "Student Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Class", accessor: "class", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.class}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Generate Admit Cards" description="Select criteria to generate and print student admit cards." onFilter={() => {}} onReset={() => {}}>
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
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/10">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard size={18} className="text-rose-600" /> Bulk Admit Card Generation
          </h3>
          <div className="flex gap-2">
             <button className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2">
               <Printer size={18} /> Print All
             </button>
             <button className="px-6 py-2.5 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-100 flex items-center gap-2">
               <Download size={18} /> Export PDF
             </button>
          </div>
        </div>
        <DataTable columns={columns} data={mockAdmitCards} />
      </div>
    </div>
  );
};

export default AdmitCard;
