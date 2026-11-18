import React from "react";
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage, inputClass, labelClass } from "./ModuleState";

const emptyForm = { grade: "", minPercent: "", maxPercent: "", gradePoint: "", remark: "" };

const ExamGrade = () => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(() => apiService.examSetup.grades.list(), []);
  const rows = data || [];
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      const payload = {
        grade: form.grade.trim(),
        minPercent: Number(form.minPercent),
        maxPercent: Number(form.maxPercent),
        gradePoint: form.gradePoint === "" ? undefined : Number(form.gradePoint),
        remark: form.remark.trim() || undefined,
      };
      if (editingId) await apiService.examSetup.grades.update(editingId, payload);
      else await apiService.examSetup.grades.create(payload);
      reset();
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      grade: row.grade ?? "",
      minPercent: row.minPercent ?? "",
      maxPercent: row.maxPercent ?? "",
      gradePoint: row.gradePoint ?? "",
      remark: row.remark ?? "",
    });
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete grade "${row.grade}"?`)) return;
    setActionError("");
    try {
      await apiService.examSetup.grades.remove(row.id);
      if (editingId === row.id) reset();
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  const columns = [
    { header: "Grade", accessor: "grade", render: (row) => <span className="font-bold text-slate-900">{row.grade}</span> },
    { header: "Range (%)", accessor: "range", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.minPercent} - {row.maxPercent}</span> },
    { header: "Grade Point", accessor: "gradePoint", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.gradePoint ?? "-"}</span> },
    { header: "Remark", accessor: "remark", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.remark || "-"}</span> },
  ];
  const actions = [
    { icon: Edit, label: "Edit", onClick: startEdit },
    { icon: Trash2, label: "Delete", variant: "danger", onClick: remove },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
            <Plus size={18} className="text-slate-600" /> {editingId ? "Edit Grade" : "Add Grade"}
          </h3>
          <form className="space-y-4" onSubmit={submit}>
            {actionError && <Notice tone="error">{actionError}</Notice>}
            <div className="space-y-2">
              <label className={labelClass}>Grade *</label>
              <input type="text" required value={form.grade} onChange={set("grade")} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Min % *</label>
                <input type="number" required min="0" max="100" step="any" value={form.minPercent} onChange={set("minPercent")} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Max % *</label>
                <input type="number" required min="0" max="100" step="any" value={form.maxPercent} onChange={set("maxPercent")} className={inputClass} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Grade Point</label>
              <input type="number" step="any" value={form.gradePoint} onChange={set("gradePoint")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Remark</label>
              <input type="text" value={form.remark} onChange={set("remark")} className={inputClass} />
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Grade" : "Save Grade"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="w-full text-xs font-bold text-slate-500 underline">Cancel edit</button>
            )}
          </form>
        </div>
      </div>
      <div className="xl:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Exam Grades</h3>
          </div>
          <LoadState loading={loading} error={error} onRetry={reload} />
          {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} actions={actions} /> : <EmptyState>No grades found.</EmptyState>)}
        </div>
      </div>
    </div>
  );
};

export default ExamGrade;
