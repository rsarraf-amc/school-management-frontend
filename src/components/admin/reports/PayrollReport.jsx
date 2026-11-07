import React from "react";
import { Download, FileText } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { payrollReports } from "../../../mock/reportsData";

const PayrollReport = () => {
  const columns = [
    { header: "Payslip ID", accessor: "payslipId", render: (row) => <span className="font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.payslipId}</span> },
    { header: "Staff Name", accessor: "staffName", render: (row) => <span className="font-bold text-slate-900">{row.staffName}</span> },
    { header: "Role", accessor: "role", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.role}</span> },
    { header: "Month / Year", accessor: "monthYear", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.monthYear}</span> },
    { header: "Net Salary", accessor: "netSalary", render: (row) => <span className="font-bold text-slate-700">₹{row.netSalary}</span> },
    { header: "Status", accessor: "status", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
       }`}>
          {row.status}
       </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Payroll Report" 
         description="Review staff salary disbursements."
         onFilter={() => {}} 
         onReset={() => {}}
      >
        <FilterItem label="Month">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">Select Month</option>
              <option value="April 2024">April 2024</option>
           </select>
        </FilterItem>
        <FilterItem label="Role">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Roles</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
              <option value="Driver">Driver</option>
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-violet-600" />
            Salary Disbursements
          </h3>
          <div className="flex gap-2">
             <button className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2">
               <Download size={18} /> CSV
             </button>
             <button className="px-6 py-2.5 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all text-sm shadow-lg shadow-violet-100 flex items-center gap-2">
               <Download size={18} /> Export PDF
             </button>
          </div>
        </div>
        <DataTable columns={columns} data={payrollReports} />
      </div>
    </div>
  );
};

export default PayrollReport;
