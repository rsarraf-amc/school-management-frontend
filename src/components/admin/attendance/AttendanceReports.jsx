import React, { useMemo, useState } from "react";
import { Download, Filter } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium appearance-none";

const AttendanceReports = () => {
  const now = new Date();
  const [reportType, setReportType] = useState("monthly");
  const [filters, setFilters] = useState({ classId: "", section: "", month: now.getMonth() + 1, year: now.getFullYear() });

  const { data, loading, error } = useAsync(async () => {
    const [records, students, classes] = await Promise.all([
      apiService.attendance.list({ Type: "STUDENT" }),
      apiService.getAllStudents(),
      apiService.getAllClasses(),
    ]);
    return { records, students, classes };
  }, { records: [], students: [], classes: [] });

  const sections = useMemo(
    () => [...new Set(data.students
      .filter((s) => !filters.classId || String(s.classId) === filters.classId)
      .map((s) => s.section).filter(Boolean))].sort(),
    [data.students, filters.classId],
  );

  const rows = useMemo(() => {
    const prefix = reportType === "monthly" ? `${filters.year}-${String(filters.month).padStart(2, "0")}` : `${filters.year}-`;
    const counts = new Map();
    data.records.filter((r) => String(r.date).startsWith(prefix)).forEach((r) => {
      const c = counts.get(r.studentId) || { present: 0, absent: 0, late: 0, half: 0, leave: 0 };
      if (r.status === "Present") c.present += 1;
      else if (r.status === "Absent") c.absent += 1;
      else if (r.status === "Late") c.late += 1;
      else if (r.status === "Half Day") c.half += 1;
      else if (r.status === "Leave") c.leave += 1;
      counts.set(r.studentId, c);
    });
    return data.students
      .filter((s) => (!filters.classId || String(s.classId) === filters.classId) && (!filters.section || s.section === filters.section))
      .map((s) => {
        const c = counts.get(s.id) || { present: 0, absent: 0, late: 0, half: 0, leave: 0 };
        const total = c.present + c.absent + c.late + c.half + c.leave;
        const attended = c.present + c.late + c.half * 0.5;
        return {
          id: s.id,
          student: [s.firstName, s.lastName].filter(Boolean).join(" "),
          ...c,
          percentage: total ? Math.round((attended / total) * 100) : null,
        };
      });
  }, [data, filters, reportType]);

  const columns = [
    { header: "Student Name", accessor: "student", render: (row) => <span className="font-bold text-slate-900">{row.student}</span> },
    { header: "Present Days", render: (row) => <span className="text-emerald-600 font-bold">{row.present}</span> },
    { header: "Absent Days", render: (row) => <span className="text-rose-600 font-bold">{row.absent}</span> },
    { header: "Late Days", render: (row) => <span className="text-amber-600 font-bold">{row.late}</span> },
    {
      header: "Percentage",
      render: (row) => {
        const val = row.percentage;
        if (val == null) return <span className="text-xs text-slate-400">No records</span>;
        return (
          <div className="flex items-center gap-3">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${val > 85 ? "bg-emerald-500" : val > 75 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${val}%` }}></div>
            </div>
            <span className="font-black text-slate-700 text-xs">{val}%</span>
          </div>
        );
      },
    },
  ];

  const tab = (key) => `px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === key ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`;
  const set = (name, value) => setFilters((prev) => ({ ...prev, [name]: value, ...(name === "classId" ? { section: "" } : {}) }));
  const years = [now.getFullYear() - 2, now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  const exportCsv = () => {
    const header = "Student,Present,Absent,Late,Half Day,Leave,Percentage";
    const lines = rows.map((r) => [`"${r.student}"`, r.present, r.absent, r.late, r.half, r.leave, r.percentage ?? ""].join(","));
    const url = URL.createObjectURL(new Blob([[header, ...lines].join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${reportType}-${filters.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1 bg-slate-100 w-fit rounded-2xl border border-slate-200">
        <button onClick={() => setReportType("monthly")} className={tab("monthly")}>Monthly</button>
        <button onClick={() => setReportType("yearly")} className={tab("yearly")}>Yearly</button>
      </div>

      <FilterBar
        title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report Filters`}
        description={`Configure parameters to generate the ${reportType} attendance report.`}
        onFilter={() => {}}
        onReset={() => setFilters({ classId: "", section: "", month: now.getMonth() + 1, year: now.getFullYear() })}
        icon={Filter}
      >
        <FilterItem label="Class">
          <select className={selectClass} value={filters.classId} onChange={(e) => set("classId", e.target.value)}>
            <option value="">All Classes</option>
            {data.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Section">
          <select className={selectClass} value={filters.section} onChange={(e) => set("section", e.target.value)}>
            <option value="">All Sections</option>
            {sections.map((s) => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </FilterItem>
        {reportType === "monthly" && (
          <FilterItem label="Month">
            <select className={selectClass} value={filters.month} onChange={(e) => set("month", Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
          </FilterItem>
        )}
        <FilterItem label="Year">
          <select className={selectClass} value={filters.year} onChange={(e) => set("year", Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Attendance Breakdown</h3>
          <button
            onClick={exportCsv}
            disabled={!rows.length}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all text-xs shadow-sm disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-medium text-rose-600">{error}</div>
        ) : !rows.length ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">No students found.</div>
        ) : (
          <DataTable columns={columns} data={rows} />
        )}
      </div>
    </div>
  );
};

export default AttendanceReports;
