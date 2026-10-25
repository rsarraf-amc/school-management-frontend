import React, { useState } from "react";
import { Save } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { staffList } from "../../../mock/hrData";

const ManualAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState(
    staffList.map(s => ({ ...s, attendance: "Present", note: "" }))
  );

  const updateStatus = (id, newStatus) => {
    setRecords(prev => prev.map(rec => rec.id === id ? { ...rec, attendance: newStatus } : rec));
  };

  const columns = [
    { header: "Staff ID", accessor: "staffId", render: (row) => <span className="font-bold text-slate-900">{row.staffId}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Role", accessor: "role", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.role}</span> },
    {
      header: "Attendance",
      render: (row) => (
        <div className="flex items-center gap-2">
          {["Present", "Absent", "Late", "Half Day"].map((status) => (
            <label key={status} className="flex items-center gap-1 cursor-pointer group">
              <input
                type="radio"
                name={`attendance-${row.id}`}
                checked={row.attendance === status}
                onChange={() => updateStatus(row.id, status)}
                className="hidden"
              />
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                row.attendance === status 
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
      header: "Note",
      render: (row) => (
        <input
          type="text"
          placeholder="Optional note..."
          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20"
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Mark Attendance" 
         description="Select Role and Date to mark staff attendance manually."
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
        <FilterItem label="Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Staff List</h3>
          <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2">
            <Save size={18} /> Save Attendance
          </button>
        </div>
        <DataTable columns={columns} data={records} />
      </div>
    </div>
  );
};

export default ManualAttendance;
