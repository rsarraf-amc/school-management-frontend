import React, { useState } from "react";
import { Search, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { attendanceRecords } from "../../../mock/attendanceData";

const DailyAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState(attendanceRecords);

  const columns = [
    {
      header: "Class (Section)",
      accessor: "class",
      render: (row) => <span className="font-bold text-slate-700">Class {row.class} ({row.section})</span>
    },
    {
      header: "Total Students",
      accessor: "id",
      render: () => <span className="font-medium text-slate-500">45</span>
    },
    {
      header: "Present",
      render: () => <span className="text-emerald-600 font-black">40</span>
    },
    {
      header: "Absent",
      render: () => <span className="text-rose-600 font-black">3</span>
    },
    {
      header: "Late",
      render: () => <span className="text-amber-600 font-black">2</span>
    },
    {
      header: "Half Day",
      render: () => <span className="text-indigo-600 font-black">0</span>
    },
    {
      header: "Status",
      render: () => (
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase border border-emerald-100">
           Completed
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        title="Date Wise Attendance"
        description="Select a date to view the overall attendance summary."
        onFilter={() => {}}
        onReset={() => setDate(new Date().toISOString().split('T')[0])}
      >
        <FilterItem label="Select Date">
           <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input
               type="date"
               className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
               value={date}
               onChange={(e) => setDate(e.target.value)}
             />
           </div>
        </FilterItem>
      </FilterBar>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <CheckCircle size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Present</p>
                <p className="text-2xl font-black text-slate-900">412</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <XCircle size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Absent</p>
                <p className="text-2xl font-black text-slate-900">28</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Clock size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Late</p>
                <p className="text-2xl font-black text-slate-900">10</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Calendar size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Leave</p>
                <p className="text-2xl font-black text-slate-900">5</p>
             </div>
          </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Class-wise Summary</h3>
        </div>
        <DataTable columns={columns} data={[attendanceRecords[0]]} />
      </div>
    </div>
  );
};

export default DailyAttendance;
