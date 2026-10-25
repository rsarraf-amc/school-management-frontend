import React from "react";
import { Download, DollarSign } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { feesReports } from "../../../mock/reportsData";

const FeesReport = () => {
  const columns = [
    { header: "Receipt No", accessor: "receiptNo", render: (row) => <span className="font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.receiptNo}</span> },
    { header: "Student Name", accessor: "studentName", render: (row) => <span className="font-bold text-slate-900">{row.studentName}</span> },
    { header: "Class", accessor: "class", render: (row) => <span className="font-medium text-slate-600">Class {row.class}</span> },
    { header: "Fee Type", accessor: "feeType", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.feeType}</span> },
    { header: "Paid Amount", accessor: "paidAmount", render: (row) => <span className="font-bold text-emerald-600">₹{row.paidAmount}</span> },
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Fees Collection Report" 
         description="Analyze student fee collections."
         onFilter={() => {}} 
         onReset={() => {}}
      >
        <FilterItem label="Class">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Classes</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
           </select>
        </FilterItem>
        <FilterItem label="Fee Type">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Types</option>
              <option value="Tuition Fee">Tuition Fee</option>
              <option value="Transport Fee">Transport Fee</option>
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
            <DollarSign size={18} className="text-blue-600" />
            Fee Collections
          </h3>
          <div className="flex gap-2">
             <button className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2">
               <Download size={18} /> CSV
             </button>
             <button className="px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-100 flex items-center gap-2">
               <Download size={18} /> Export PDF
             </button>
          </div>
        </div>
        <DataTable columns={columns} data={feesReports} />
      </div>
    </div>
  );
};

export default FeesReport;
