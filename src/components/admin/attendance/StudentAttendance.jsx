import React, { useState } from "react";
import { Search, Save, UserCheck, AlertCircle } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { attendanceRecords } from "../../../mock/attendanceData";

const StudentAttendance = () => {
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [records, setRecords] = useState(attendanceRecords);
  const [isSearching, setIsSearching] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API delay
    setTimeout(() => {
        setIsSearching(false);
    }, 500);
  };

  const updateStatus = (id, newStatus) => {
    setRecords(prev => prev.map(rec => rec.id === id ? { ...rec, status: newStatus } : rec));
  };

  const columns = [
    {
      header: "Admission No",
      accessor: "admissionNo",
      render: (row) => <span className="font-bold text-slate-900">{row.admissionNo}</span>
    },
    {
      header: "Roll No",
      accessor: "rollNo",
    },
    {
      header: "Student Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.name}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Class {row.class} - {row.section}</span>
        </div>
      )
    },
    {
      header: "Attendance",
      accessor: "status",
      render: (row) => (
        <div className="flex items-center gap-2">
          {["Present", "Absent", "Late", "Half Day"].map((status) => (
            <label key={status} className="flex items-center gap-1 cursor-pointer group">
              <input
                type="radio"
                name={`attendance-${row.id}`}
                checked={row.status === status}
                onChange={() => updateStatus(row.id, status)}
                className="hidden"
              />
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                row.status === status 
                  ? status === "Present" ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100" 
                  : status === "Absent" ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100"
                  : status === "Late" ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-100"
                  : "bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-100"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
              }`}>
                {status[0]}
              </span>
            </label>
          ))}
        </div>
      )
    },
    {
      header: "Remark",
      accessor: "remark",
      render: (row) => (
        <input
          type="text"
          placeholder="Optional remark..."
          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          value={row.remark}
          onChange={(e) => setRecords(prev => prev.map(rec => rec.id === row.id ? { ...rec, remark: e.target.value } : rec))}
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        title="Attendance Selection"
        description="Select class, section and date to mark attendance."
        onFilter={handleSearch}
        onReset={() => setFilters({ class: "", section: "", date: new Date().toISOString().split('T')[0] })}
      >
        <FilterItem label="Class *">
          <select
            name="class"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium appearance-none"
            value={filters.class}
            onChange={handleFilterChange}
          >
            <option value="">Select Class</option>
            <option value="10">Class 10</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </FilterItem>
        <FilterItem label="Section *">
          <select
            name="section"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium appearance-none"
            value={filters.section}
            onChange={handleFilterChange}
          >
            <option value="">Select Section</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </FilterItem>
        <FilterItem label="Date *">
          <input
            type="date"
            name="date"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
             <h3 className="font-black text-slate-900 tracking-tight">Student List</h3>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Marked: 4/5</span>
             </div>
          </div>
          <button 
             className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2"
             onClick={() => alert("Attendance saved successfully!")}
          >
            <Save size={18} />
            Save Attendance
          </button>
        </div>
        <DataTable columns={columns} data={records} />
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800">
         <AlertCircle size={20} className="shrink-0" />
         <p className="text-sm font-medium">
            Once saved, attendance records will be synchronized with student profiles and parent portals. 
            Ensure all data is accurate before final submission.
         </p>
      </div>
    </div>
  );
};

export default StudentAttendance;
