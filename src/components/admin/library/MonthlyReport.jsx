import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { issueRecords } from "../../../mock/libraryData";

const MonthlyReport = () => {
  const [records, setRecords] = useState(issueRecords);

  const columns = [
    { header: "Book Title", accessor: "bookTitle", render: (row) => <span className="font-bold text-slate-900">{row.bookTitle}</span> },
    { header: "Book No", accessor: "bookNo", render: (row) => <span className="font-black text-slate-600 bg-slate-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.bookNo}</span> },
    { header: "Member ID", accessor: "memberId", render: (row) => <span className="font-medium text-slate-500 text-xs">{row.memberId}</span> },
    { header: "Member Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Issue Date", accessor: "issueDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.issueDate}</span> },
    { header: "Return Date", accessor: "returnDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.returnDate || "-"}</span> },
    { header: "Status", accessor: "status", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === "Returned" ? "bg-emerald-50 text-emerald-600" : 
          row.status === "Overdue" ? "bg-rose-50 text-rose-600" :
          "bg-blue-50 text-blue-600"
       }`}>
          {row.status}
       </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Monthly Circulation Report" 
         description="Filter library transactions by Month and Year."
         onFilter={() => {}} 
         onReset={() => {}}
      >
        <FilterItem label="Month *">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="4">April</option>
           </select>
        </FilterItem>
        <FilterItem label="Year *">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="2024">2024</option>
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-violet-600" />
            Report Data
          </h3>
          <button className="px-6 py-2.5 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all text-sm shadow-lg shadow-violet-100 flex items-center gap-2">
            <Download size={18} /> Export PDF
          </button>
        </div>
        <DataTable columns={columns} data={records} />
      </div>
    </div>
  );
};

export default MonthlyReport;
