import React from "react";
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage, inputClass, labelClass } from "./ModuleState";

const emptyForm = { studentId: "", observationTypeId: "", date: "", remark: "" };
const studentName = (s) => [s?.firstName, s?.lastName].filter(Boolean).join(" ") || "-";

const Observation = () => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(async () => {
    const [observations, students, types] = await Promise.all([
      apiService.examSetup.observations.list(),
      apiService.getAllStudents(),
      apiService.examSetup.observationTypes.list(),
    ]);
    return { observations, students, types };
  }, { observations: [], students: [], types: [] });
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
        studentId: form.studentId,
        observationTypeId: form.observationTypeId,
        date: form.date || undefined,
        remark: form.remark.trim() || undefined,
      };
      if (editingId) await apiService.examSetup.observations.update(editingId, payload);
      else await apiService.examSetup.observations.create(payload);
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
      studentId: String(row.studentId ?? row.student?.id ?? ""),
      observationTypeId: String(row.observationTypeId ?? row.observationType?.id ?? ""),
      date: row.date ? String(row.date).slice(0, 10) : "",
      remark: row.remark || "",
    });
  };

  const remove = async (row) => {
    if (!window.confirm("Delete this observation?")) return;
    setActionError("");
    try {
      await apiService.examSetup.observations.remove(row.id);
      if (editingId === row.id) reset();
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  const columns = [
    { header: "Student", accessor: "student", render: (row) => <span className="font-bold text-slate-900">{studentName(row.student)}</span> },
    { header: "Type", accessor: "type", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.observationType?.name || "-"}</span> },
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date ? String(row.date).slice(0, 10) : "-"}</span> },
    { header: "Remark", accessor: "remark", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.remark || "-"}</span> },
  ];
  const actions = [
    { icon: Edit, label: "Edit", onClick: startEdit },
    { icon: Trash2, label: "Delete", variant: "danger", onClick: remove },
  ];
  const rows = data?.observations || [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
            <Plus size={18} className="text-slate-600" /> {editingId ? "Edit Observation" : "Add Observation"}
          </h3>
          <form className="space-y-4" onSubmit={submit}>
            {actionError && <Notice tone="error">{actionError}</Notice>}
            <div className="space-y-2">
              <label className={labelClass}>Student *</label>
              <select required value={form.studentId} onChange={set("studentId")} className={inputClass}>
                <option value="">Select Student</option>
                {(data?.students || []).map((s) => <option key={s.id} value={s.id}>{studentName(s)}{s.admissionNumber ? ` (${s.admissionNumber})` : ""}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Observation Type *</label>
              <select required value={form.observationTypeId} onChange={set("observationTypeId")} className={inputClass}>
                <option value="">Select Type</option>
                {(data?.types || []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Date</label>
              <input type="date" value={form.date} onChange={set("date")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Remark</label>
              <textarea rows="4" value={form.remark} onChange={set("remark")} className={`${inputClass} resize-none`} />
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Observation" : "Save Observation"}
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
            <h3 className="font-black text-slate-900 tracking-tight">Observations</h3>
          </div>
          <LoadState loading={loading} error={error} onRetry={reload} />
          {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} actions={actions} /> : <EmptyState>No observations found.</EmptyState>)}
        </div>
      </div>
    </div>
  );
};

export default Observation;
