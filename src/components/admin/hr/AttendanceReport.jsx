import React from "react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { staffList } from "../../../mock/hrData";

const AttendanceReport = () => {
  const columns = [
    { header: "Staff Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Role", accessor: "role", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.role}</span> },
    { header: "Present", render: () => <span className="text-emerald-600 font-bold">22</span> },
    { header: "Absent", render: () => <span className="text-rose-600 font-bold">1</span> },
    { header: "Late", render: () => <span className="text-amber-600 font-bold">0</span> },
    { header: "Half Day", render: () => <span className="text-indigo-600 font-bold">0</span> },
    { header: "Total %", render: () => <span className="font-black text-slate-700">95%</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Attendance Report" 
         description="Filter reports by Role, Month and Year."
         onFilter={() => {}} 
         onReset={() => {}}
      >
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
          <h3 className="font-black text-slate-900 tracking-tight">Staff Attendance Report</h3>
        </div>
        <DataTable columns={columns} data={staffList} />
      </div>
    </div>
  );
};

export default AttendanceReport;
