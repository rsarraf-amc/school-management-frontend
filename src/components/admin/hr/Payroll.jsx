import React, { useState } from "react";
import { DollarSign, FileText, Download } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { staffList } from "../../../mock/hrData";

const Payroll = () => {
  const columns = [
    { header: "Staff ID", accessor: "staffId", render: (row) => <span className="font-bold text-slate-900">{row.staffId}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Role", accessor: "role", render: (row) => <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-black uppercase">{row.role}</span> },
    { header: "Department", accessor: "department", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.department}</span> },
    { header: "Designation", accessor: "designation", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.designation}</span> },
    { header: "Status", render: () => <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase">Not Generated</span> },
  ];

  const actions = [
    { icon: DollarSign, label: "Generate Payroll", onClick: () => alert("Generate Payroll Form") },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Payroll Management" description="Generate and manage staff salaries and payslips." onFilter={() => {}} onReset={() => {}}>
        <FilterItem label="Role">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Roles</option>
              <option value="Teacher">Teacher</option>
              <option value="Admin">Admin</option>
           </select>
        </FilterItem>
        <FilterItem label="Month">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="4">April</option>
           </select>
        </FilterItem>
        <FilterItem label="Year">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="2024">2024</option>
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Staff Payroll List</h3>
        </div>
        <DataTable columns={columns} data={staffList} actions={actions} />
      </div>
    </div>
  );
};

export default Payroll;
