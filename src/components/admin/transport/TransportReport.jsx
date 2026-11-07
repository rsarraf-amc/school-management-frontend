import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { studentTransport, routes } from "../../../mock/transportData";

const TransportReport = () => {
  const columns = [
    { header: "Class", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.class} ({row.section})</span> },
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="font-bold text-slate-900">{row.admissionNo}</span> },
    { header: "Student Name", accessor: "studentName", render: (row) => <span className="font-bold text-slate-700">{row.studentName}</span> },
    { header: "Route Title", accessor: "routeTitle", render: (row) => <span className="font-medium text-slate-600">{row.routeTitle}</span> },
    { header: "Vehicle No", accessor: "vehicleNo", render: (row) => <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.vehicleNo}</span> },
    { header: "Fare", accessor: "fare", render: (row) => <span className="font-bold text-indigo-600">₹{row.fare}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Transport Report" 
         description="Filter transport allocations by Class, Section or Route."
         onFilter={() => {}} 
         onReset={() => {}}
      >
        <FilterItem label="Class">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Classes</option>
              <option value="10">Class 10</option>
           </select>
        </FilterItem>
        <FilterItem label="Section">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Sections</option>
              <option value="A">Section A</option>
           </select>
        </FilterItem>
        <FilterItem label="Route">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Routes</option>
              {routes.map(r => <option key={r.id} value={r.routeTitle}>{r.routeTitle}</option>)}
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-violet-600" />
            Student Transport Report
          </h3>
          <button className="px-6 py-2.5 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all text-sm shadow-lg shadow-violet-100 flex items-center gap-2">
            <Download size={18} /> Export PDF
          </button>
        </div>
        <DataTable columns={columns} data={studentTransport} />
      </div>
    </div>
  );
};

export default TransportReport;
