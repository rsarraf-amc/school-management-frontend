import React, { useState } from "react";
import { ArrowUpCircle } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";
import { LoadState, EmptyState, Notice, errorMessage } from "../exam/ModuleState";

const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none disabled:opacity-60";
const studentName = (s) => [s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");

const PromoteStudents = () => {
  const [fromClassId, setFromClassId] = useState("");
  const [toClassId, setToClassId] = useState("");
  const [selected, setSelected] = useState([]);
  const [promoting, setPromoting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [result, setResult] = useState("");
  const { data, loading, error, reload } = useAsync(async () => {
    const [classes, students] = await Promise.all([apiService.getAllClasses(), apiService.getAllStudents()]);
    return { classes, students };
  }, { classes: [], students: [] });

  const classes = data?.classes || [];
  const students = fromClassId
    ? (data?.students || []).filter((s) => String(s.classId) === String(fromClassId))
    : [];
  const allSelected = students.length > 0 && students.every((s) => selected.includes(s.id));

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () => setSelected(allSelected ? [] : students.map((s) => s.id));

  const changeFrom = (value) => {
    setFromClassId(value);
    setSelected([]);
    setResult("");
    setActionError("");
  };

  const promote = async () => {
    setActionError("");
    setResult("");
    if (!fromClassId || !toClassId) {
      setActionError("Select both the current class and the target class.");
      return;
    }
    if (fromClassId === toClassId) {
      setActionError("Target class must be different from the current class.");
      return;
    }
    if (!selected.length) {
      setActionError("Select at least one student to promote.");
      return;
    }
    setPromoting(true);
    try {
      const res = await apiService.academics.promote({ fromClassId, toClassId, studentIds: selected });
      setResult(`${res?.promoted ?? 0} student(s) promoted successfully.`);
      setSelected([]);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FilterBar title="Promotion Criteria" description="Select current and target class for promotion." onFilter={reload} onReset={() => { changeFrom(""); setToClassId(""); }}>
        <FilterItem label="Current Class *">
          <select value={fromClassId} onChange={(e) => changeFrom(e.target.value)} className={selectClass}>
            <option value="">{loading ? "Loading..." : "Select Class"}</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Target Class *">
          <select value={toClassId} onChange={(e) => setToClassId(e.target.value)} className={selectClass}>
            <option value="">{loading ? "Loading..." : "Select Next Class"}</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FilterItem>
      </FilterBar>
      {actionError && <Notice tone="error">{actionError}</Notice>}
      {result && <Notice tone="success">{result}</Notice>}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Student Progression List</h3>
          <button type="button" onClick={promote} disabled={promoting || !selected.length} className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm disabled:opacity-50 flex items-center gap-2">
            <ArrowUpCircle size={18} /> {promoting ? "Promoting..." : `Promote Students${selected.length ? ` (${selected.length})` : ""}`}
          </button>
        </div>
        <LoadState loading={loading} error={error} onRetry={reload} />
        {!loading && !error && (!fromClassId ? (
          <EmptyState>Select the current class to list its students.</EmptyState>
        ) : students.length === 0 ? (
          <EmptyState>No students in this class.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr className="text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4 text-left w-12">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
                  </th>
                  <th className="px-6 py-4 text-left">Admission No</th>
                  <th className="px-6 py-4 text-left">Student Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{s.admissionNumber || "-"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{studentName(s)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoteStudents;
