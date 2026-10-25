import React, { useState } from "react";
import { Search, Download, FileText, Filter } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { monthlyAttendanceData } from "../../../mock/attendanceData";

const AttendanceReports = () => {
  const [reportType, setReportType] = useState("monthly");
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    month: "4",
    year: "2024"
  });

  const columns = [
    {
      header: "Student Name",
      accessor: "student",
      render: (row) => <span className="font-bold text-slate-900">{row.student}</span>
    },
    {
      header: "Present Days",
      accessor: "present",
      render: (row) => <span className="text-emerald-600 font-bold">{row.present}</span>
    },
    {
      header: "Absent Days",
      accessor: "absent",
      render: (row) => <span className="text-rose-600 font-bold">{row.absent}</span>
    },
    {
      header: "Late Days",
      accessor: "late",
      render: (row) => <span className="text-amber-600 font-bold">{row.late}</span>
    },
    {
      header: "Percentage",
      accessor: "percentage",
      render: (row) => {
        const val = parseInt(row.percentage);
        return (
          <div className="flex items-center gap-3">
             <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                   className={`h-full rounded-full ${val > 85 ? 'bg-emerald-500' : val > 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                   style={{ width: row.percentage }}
                ></div>
             </div>
             <span className="font-black text-slate-700 text-xs">{row.percentage}</span>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1 bg-slate-100 w-fit rounded-2xl border border-slate-200">
         <button 
            onClick={() => setReportType("monthly")}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === "monthly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
         >
            Monthly
         </button>
         <button 
            onClick={() => setReportType("yearly")}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === "yearly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
         >
            Yearly
         </button>
      </div>

      <FilterBar
        title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Filters`}
        description={`Configure parameters to generate the ${reportType} attendance report.`}
        onFilter={() => {}}
        onReset={() => {}}
        icon={Filter}
      >
        <FilterItem label="Class">
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium appearance-none">
            <option value="">Select Class</option>
            <option value="10">Class 10</option>
          </select>
        </FilterItem>
        <FilterItem label="Section">
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium appearance-none">
            <option value="">Select Section</option>
            <option value="A">Section A</option>
          </select>
        </FilterItem>
        {reportType === "monthly" && (
           <FilterItem label="Month">
             <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium appearance-none">
               <option value="4">April</option>
               <option value="5">May</option>
             </select>
           </FilterItem>
        )}
        <FilterItem label="Year">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium appearance-none">
             <option value="2024">2024</option>
             <option value="2023">2023</option>
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            Attendance Breakdown
          </h3>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all text-xs shadow-sm">
            <Download size={16} />
            Export PDF
          </button>
        </div>
        <DataTable columns={columns} data={monthlyAttendanceData} />
      </div>
    </div>
  );
};

export default AttendanceReports;
