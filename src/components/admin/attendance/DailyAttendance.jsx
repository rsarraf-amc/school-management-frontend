import React, { useMemo, useState } from "react";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";

const today = () => new Date().toISOString().split("T")[0];

const DailyAttendance = () => {
  const [date, setDate] = useState(today());
  const [reloadKey, setReloadKey] = useState(0);

  // useAsync loads once; remounting on date change re-fetches
  return (
    <DailyView
      key={`${date}-${reloadKey}`}
      date={date}
      setDate={setDate}
      onReset={() => { setDate(today()); setReloadKey((k) => k + 1); }}
    />
  );
};

const DailyView = ({ date, setDate, onReset }) => {
  const { data, loading, error } = useAsync(async () => {
    const [records, students, classes] = await Promise.all([
      apiService.attendance.list({ Type: "STUDENT", Date: date }),
      apiService.getAllStudents(),
      apiService.getAllClasses(),
    ]);
    return { records, students, classes };
  }, null);

  const { totals, rows } = useMemo(() => {
    if (!data) return { totals: {}, rows: [] };
    const studentById = new Map(data.students.map((s) => [s.id, s]));
    const classNames = new Map(data.classes.map((c) => [String(c.id), c.name]));
    const groups = new Map();
    const totals = { Present: 0, Absent: 0, Late: 0, Leave: 0, "Half Day": 0 };
    data.students.forEach((s) => {
      const key = `${s.classId}|${s.section || ""}`;
      if (!groups.has(key)) groups.set(key, { id: key, name: classNames.get(String(s.classId)) || s.class || "-", section: s.section || "-", total: 0, Present: 0, Absent: 0, Late: 0, Leave: 0, "Half Day": 0, marked: 0 });
      groups.get(key).total += 1;
    });
    data.records.forEach((r) => {
      totals[r.status] = (totals[r.status] || 0) + 1;
      const s = studentById.get(r.studentId);
      if (!s) return;
      const g = groups.get(`${s.classId}|${s.section || ""}`);
      g[r.status] = (g[r.status] || 0) + 1;
      g.marked += 1;
    });
    return { totals, rows: [...groups.values()] };
  }, [data]);

  const columns = [
    { header: "Class (Section)", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name} ({row.section})</span> },
    { header: "Total Students", render: (row) => <span className="font-medium text-slate-500">{row.total}</span> },
    { header: "Present", render: (row) => <span className="text-emerald-600 font-black">{row.Present}</span> },
    { header: "Absent", render: (row) => <span className="text-rose-600 font-black">{row.Absent}</span> },
    { header: "Late", render: (row) => <span className="text-amber-600 font-black">{row.Late}</span> },
    { header: "Half Day", render: (row) => <span className="text-indigo-600 font-black">{row["Half Day"]}</span> },
    {
      header: "Status",
      render: (row) => {
        const done = row.total > 0 && row.marked >= row.total;
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${done ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
            {done ? "Completed" : row.marked ? "Partial" : "Not Marked"}
          </span>
        );
      },
    },
  ];

  const cards = [
    { label: "Total Present", value: totals.Present, icon: CheckCircle, style: "bg-emerald-50 text-emerald-600" },
    { label: "Total Absent", value: totals.Absent, icon: XCircle, style: "bg-rose-50 text-rose-600" },
    { label: "Total Late", value: totals.Late, icon: Clock, style: "bg-amber-50 text-amber-600" },
    { label: "Total Leave", value: totals.Leave, icon: Calendar, style: "bg-indigo-50 text-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Date Wise Attendance" description="Select a date to view the overall attendance summary." onFilter={() => {}} onReset={onReset}>
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

      {loading ? (
        <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>
      ) : error ? (
        <div className="p-8 text-center text-sm font-medium text-rose-600">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {cards.map(({ label, value, icon: Icon, style }) => (
              <div key={label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${style}`}><Icon size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                  <p className="text-2xl font-black text-slate-900">{value || 0}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <h3 className="font-black text-slate-900 tracking-tight">Class-wise Summary</h3>
            </div>
            {rows.length ? (
              <DataTable columns={columns} data={rows} />
            ) : (
              <div className="p-8 text-center text-sm font-medium text-slate-500">No students found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DailyAttendance;
