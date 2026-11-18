import React, { useEffect, useMemo, useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";

const STATUSES = ["Present", "Absent", "Late", "Half Day"];
const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium appearance-none";
const today = () => new Date().toISOString().split("T")[0];

const StudentAttendance = () => {
  const [filters, setFilters] = useState({ classId: "", section: "", date: today() });
  const [marks, setMarks] = useState({});
  const [remarks, setRemarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingMarks, setLoadingMarks] = useState(false);

  const { data, loading, error } = useAsync(async () => {
    const [students, classes] = await Promise.all([apiService.getAllStudents(), apiService.getAllClasses()]);
    return { students, classes };
  }, { students: [], classes: [] });

  const sections = useMemo(
    () => [...new Set(data.students
      .filter((s) => !filters.classId || String(s.classId) === filters.classId)
      .map((s) => s.section).filter(Boolean))].sort(),
    [data.students, filters.classId],
  );

  const rows = useMemo(() => {
    if (!filters.classId) return [];
    return data.students
      .filter((s) => String(s.classId) === filters.classId && (!filters.section || s.section === filters.section))
      .map((s) => ({ ...s, name: [s.firstName, s.lastName].filter(Boolean).join(" ") }));
  }, [data.students, filters.classId, filters.section]);

  useEffect(() => {
    let active = true;
    setLoadingMarks(true);
    setMessage("");
    apiService.attendance.list({ Type: "STUDENT", Date: filters.date })
      .then((list) => {
        if (!active) return;
        setMarks(Object.fromEntries(list.map((r) => [r.studentId, r.status])));
        setRemarks(Object.fromEntries(list.map((r) => [r.studentId, r.remark || ""])));
      })
      .catch((e) => active && setMessage(e.message))
      .finally(() => active && setLoadingMarks(false));
    return () => { active = false; };
  }, [filters.date]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, ...(name === "classId" ? { section: "" } : {}) }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await apiService.attendance.saveBulk({
        type: "STUDENT",
        date: filters.date,
        records: rows.map((s) => ({
          StudentId: s.id,
          Status: marks[s.id] || "Present",
          Remark: remarks[s.id] || null,
        })),
      });
      setMessage("Attendance saved successfully.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { header: "Admission No", accessor: "admissionNumber", render: (row) => <span className="font-bold text-slate-900">{row.admissionNumber}</span> },
    { header: "Roll No", accessor: "rollNumber" },
    {
      header: "Student Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.name}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase">{row.class}{row.section ? ` - ${row.section}` : ""}</span>
        </div>
      ),
    },
    {
      header: "Attendance",
      render: (row) => (
        <div className="flex items-center gap-2">
          {STATUSES.map((status) => {
            const active = (marks[row.id] || "Present") === status;
            return (
              <button
                type="button"
                key={status}
                title={status}
                onClick={() => setMarks((prev) => ({ ...prev, [row.id]: status }))}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  active
                    ? status === "Present" ? "bg-emerald-500 text-white border-emerald-500"
                    : status === "Absent" ? "bg-rose-500 text-white border-rose-500"
                    : status === "Late" ? "bg-amber-500 text-white border-amber-500"
                    : "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                }`}
              >
                {status[0]}
              </button>
            );
          })}
        </div>
      ),
    },
    {
      header: "Remark",
      render: (row) => (
        <input
          type="text"
          placeholder="Optional remark..."
          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          value={remarks[row.id] || ""}
          onChange={(e) => setRemarks((prev) => ({ ...prev, [row.id]: e.target.value }))}
        />
      ),
    },
  ];

  const markedCount = rows.filter((s) => marks[s.id]).length;

  return (
    <div className="space-y-6">
      <FilterBar
        title="Attendance Selection"
        description="Select class, section and date to mark attendance."
        onFilter={() => {}}
        onReset={() => setFilters({ classId: "", section: "", date: today() })}
      >
        <FilterItem label="Class *">
          <select name="classId" className={selectClass} value={filters.classId} onChange={handleFilterChange}>
            <option value="">Select Class</option>
            {data.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Section">
          <select name="section" className={selectClass} value={filters.section} onChange={handleFilterChange}>
            <option value="">All Sections</option>
            {sections.map((s) => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Date *">
          <input type="date" name="date" className={selectClass} value={filters.date} onChange={handleFilterChange} />
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-4">
            <h3 className="font-black text-slate-900 tracking-tight">Student List</h3>
            {rows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Marked: {markedCount}/{rows.length}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {message && <span className="text-xs font-bold text-slate-600">{message}</span>}
            <button
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
              onClick={save}
              disabled={saving || loadingMarks || !rows.length}
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-medium text-rose-600">{error}</div>
        ) : !filters.classId ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">Select a class to load students.</div>
        ) : !rows.length ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">No students found for this selection.</div>
        ) : (
          <DataTable columns={columns} data={rows} />
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800">
        <AlertCircle size={20} className="shrink-0" />
        <p className="text-sm font-medium">
          Unmarked students are saved as Present. Saving again for the same date updates existing records.
        </p>
      </div>
    </div>
  );
};

export default StudentAttendance;
