import React from "react";
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage, inputClass, labelClass } from "./ModuleState";

const emptyForm = { name: "", classId: "", subjectId: "", examTypeId: "", maxMarks: "", date: "" };

const Assessment = () => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(async () => {
    const [assessments, classes, subjects, types] = await Promise.all([
      apiService.examSetup.assessments.list(),
      apiService.getAllClasses(),
      apiService.timetable.subjects.list(),
      apiService.examSetup.types.list(),
    ]);
    return { assessments, classes, subjects, types };
  }, { assessments: [], classes: [], subjects: [], types: [] });
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
        name: form.name.trim(),
        classId: form.classId || undefined,
        subjectId: form.subjectId || undefined,
        examTypeId: form.examTypeId || undefined,
        maxMarks: Number(form.maxMarks),
        date: form.date || undefined,
      };
      if (editingId) await apiService.examSetup.assessments.update(editingId, payload);
      else await apiService.examSetup.assessments.create(payload);
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
      name: row.name || "",
      classId: String(row.classId ?? row.class?.id ?? ""),
      subjectId: String(row.subjectId ?? row.subject?.id ?? ""),
      examTypeId: String(row.examTypeId ?? row.examType?.id ?? ""),
      maxMarks: row.maxMarks ?? "",
      date: row.date ? String(row.date).slice(0, 10) : "",
    });
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete assessment "${row.name}"?`)) return;
    setActionError("");
    try {
      await apiService.examSetup.assessments.remove(row.id);
      if (editingId === row.id) reset();
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  const cell = (value) => <span className="text-slate-500 font-medium text-xs">{value || "-"}</span>;
  const columns = [
    { header: "Assessment", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Class", accessor: "class", render: (row) => cell(row.class?.name) },
    { header: "Subject", accessor: "subject", render: (row) => cell(row.subject?.name) },
    { header: "Exam Type", accessor: "examType", render: (row) => cell(row.examType?.name) },
    { header: "Max Marks", accessor: "maxMarks", render: (row) => cell(row.maxMarks) },
    { header: "Date", accessor: "date", render: (row) => cell(row.date ? String(row.date).slice(0, 10) : "") },
  ];
  const actions = [
    { icon: Edit, label: "Edit", onClick: startEdit },
    { icon: Trash2, label: "Delete", variant: "danger", onClick: remove },
  ];
  const rows = data?.assessments || [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
            <Plus size={18} className="text-slate-600" /> {editingId ? "Edit Assessment" : "Add Assessment"}
          </h3>
          <form className="space-y-4" onSubmit={submit}>
            {actionError && <Notice tone="error">{actionError}</Notice>}
            <div className="space-y-2">
              <label className={labelClass}>Name *</label>
              <input type="text" required value={form.name} onChange={set("name")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Class</label>
              <select value={form.classId} onChange={set("classId")} className={inputClass}>
                <option value="">Select Class</option>
                {(data?.classes || []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Subject</label>
              <select value={form.subjectId} onChange={set("subjectId")} className={inputClass}>
                <option value="">Select Subject</option>
                {(data?.subjects || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Exam Type</label>
              <select value={form.examTypeId} onChange={set("examTypeId")} className={inputClass}>
                <option value="">Select Exam Type</option>
                {(data?.types || []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Max Marks *</label>
                <input type="number" required min="0" step="any" value={form.maxMarks} onChange={set("maxMarks")} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Date</label>
                <input type="date" value={form.date} onChange={set("date")} className={inputClass} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Assessment" : "Save Assessment"}
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
            <h3 className="font-black text-slate-900 tracking-tight">Assessments</h3>
          </div>
          <LoadState loading={loading} error={error} onRetry={reload} />
          {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} actions={actions} /> : <EmptyState>No assessments found.</EmptyState>)}
        </div>
      </div>
    </div>
  );
};

export default Assessment;
