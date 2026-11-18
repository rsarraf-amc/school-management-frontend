import React, { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";

const STATUSES = ["Present", "Absent", "Late", "Half Day"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none";
const today = () => new Date().toISOString().split("T")[0];

const useStaff = () => {
  const state = useAsync(async () => {
    const [employees, departments, designations] = await Promise.all([
      apiService.getAllEmployees(),
      apiService.departments.list(),
      apiService.designations.list(),
    ]);
    const deptNames = new Map(departments.map((d) => [String(d.id), d.departmentName]));
    const desigNames = new Map(designations.map((d) => [String(d.id), d.designationName]));
    return employees.map((e) => ({
      id: e.id,
      staffId: e.employeeNumber,
      name: [e.firstName, e.lastName].filter(Boolean).join(" "),
      department: deptNames.get(String(e.departmentId)) || "",
      role: desigNames.get(String(e.designationId)) || deptNames.get(String(e.departmentId)) || "-",
    }));
  }, []);
  const departments = useMemo(
    () => [...new Set((state.data || []).map((s) => s.department).filter(Boolean))],
    [state.data],
  );
  return { ...state, departments };
};

const Status = ({ loading, error, empty, emptyText }) => {
  if (loading) return <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-sm font-medium text-rose-600">{error}</div>;
  if (empty) return <div className="p-8 text-center text-sm font-medium text-slate-500">{emptyText}</div>;
  return null;
};

const DepartmentSelect = ({ value, onChange, departments }) => (
  <FilterItem label="Department">
    <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
      <option value="">All Departments</option>
      {departments.map((d) => <option key={d} value={d}>{d}</option>)}
    </select>
  </FilterItem>
);

export const StaffMarkPanel = () => {
  const staff = useStaff();
  const [date, setDate] = useState(today());
  const [department, setDepartment] = useState("");
  const [marks, setMarks] = useState({});
  const [notes, setNotes] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingMarks, setLoadingMarks] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingMarks(true);
    setMessage("");
    apiService.attendance.list({ Type: "STAFF", Date: date })
      .then((rows) => {
        if (!active) return;
        setMarks(Object.fromEntries(rows.map((r) => [r.employeeId, r.status])));
        setNotes(Object.fromEntries(rows.map((r) => [r.employeeId, r.remark || ""])));
      })
      .catch((e) => active && setMessage(e.message))
      .finally(() => active && setLoadingMarks(false));
    return () => { active = false; };
  }, [date]);

  const rows = useMemo(
    () => (staff.data || []).filter((s) => !department || s.department === department),
    [staff.data, department],
  );

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      await apiService.attendance.saveBulk({
        type: "STAFF",
        date,
        records: rows.map((s) => ({
          EmployeeId: s.id,
          Status: marks[s.id] || "Present",
          Remark: notes[s.id] || null,
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
    { header: "Staff ID", accessor: "staffId", render: (row) => <span className="font-bold text-slate-900">{row.staffId}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Role", accessor: "role", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.role}</span> },
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
      header: "Note",
      render: (row) => (
        <input
          type="text"
          value={notes[row.id] || ""}
          onChange={(e) => setNotes((prev) => ({ ...prev, [row.id]: e.target.value }))}
          placeholder="Optional note..."
          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Mark Attendance" description="Select Department and Date to mark staff attendance." onFilter={() => {}} onReset={() => { setDepartment(""); setDate(today()); }}>
        <DepartmentSelect value={department} onChange={setDepartment} departments={staff.departments} />
        <FilterItem label="Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
        </FilterItem>
      </FilterBar>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Staff List</h3>
          <div className="flex items-center gap-4">
            {message && <span className="text-xs font-bold text-slate-600">{message}</span>}
            <button
              onClick={save}
              disabled={saving || loadingMarks || !rows.length}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} /> {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
        <Status loading={staff.loading} error={staff.error} empty={!rows.length} emptyText="No staff found." />
        {!staff.loading && !staff.error && rows.length > 0 && <DataTable columns={columns} data={rows} />}
      </div>
    </div>
  );
};

export const StaffReportPanel = () => {
  const staff = useStaff();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [department, setDepartment] = useState("");
  const records = useAsync(() => apiService.attendance.list({ Type: "STAFF" }), []);

  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const rows = useMemo(() => {
    const counts = new Map();
    (records.data || []).filter((r) => String(r.date).startsWith(prefix)).forEach((r) => {
      const c = counts.get(r.employeeId) || { Present: 0, Absent: 0, Late: 0, "Half Day": 0, Leave: 0 };
      c[r.status] = (c[r.status] || 0) + 1;
      counts.set(r.employeeId, c);
    });
    return (staff.data || [])
      .filter((s) => !department || s.department === department)
      .map((s) => {
        const c = counts.get(s.id) || { Present: 0, Absent: 0, Late: 0, "Half Day": 0, Leave: 0 };
        const total = Object.values(c).reduce((a, b) => a + b, 0);
        const attended = c.Present + c.Late + c["Half Day"] * 0.5;
        return { ...s, ...c, percent: total ? Math.round((attended / total) * 100) : null };
      });
  }, [staff.data, records.data, prefix, department]);

  const columns = [
    { header: "Staff Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Role", accessor: "role", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.role}</span> },
    { header: "Present", render: (row) => <span className="text-emerald-600 font-bold">{row.Present}</span> },
    { header: "Absent", render: (row) => <span className="text-rose-600 font-bold">{row.Absent}</span> },
    { header: "Late", render: (row) => <span className="text-amber-600 font-bold">{row.Late}</span> },
    { header: "Half Day", render: (row) => <span className="text-indigo-600 font-bold">{row["Half Day"]}</span> },
    { header: "Total %", render: (row) => <span className="font-black text-slate-700">{row.percent == null ? "-" : `${row.percent}%`}</span> },
  ];
  const years = [year - 1, year, year + 1];

  return (
    <div className="space-y-6">
      <FilterBar title="Attendance Report" description="Filter reports by Department, Month and Year." onFilter={() => {}} onReset={() => { setDepartment(""); setMonth(now.getMonth() + 1); setYear(now.getFullYear()); }}>
        <DepartmentSelect value={department} onChange={setDepartment} departments={staff.departments} />
        <FilterItem label="Month">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectClass}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Year">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectClass}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </FilterItem>
      </FilterBar>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Staff Attendance Report</h3>
        </div>
        <Status loading={staff.loading || records.loading} error={staff.error || records.error} empty={!rows.length} emptyText="No staff found." />
        {!staff.loading && !records.loading && !staff.error && !records.error && rows.length > 0 && <DataTable columns={columns} data={rows} />}
      </div>
    </div>
  );
};
