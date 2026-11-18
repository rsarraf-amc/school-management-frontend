import React from "react";
import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage, inputClass, labelClass } from "./ModuleState";

const emptyForm = { name: "", description: "" };

const ObservationType = () => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(() => apiService.examSetup.observationTypes.list(), []);
  const rows = data || [];

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() || undefined };
      if (editingId) await apiService.examSetup.observationTypes.update(editingId, payload);
      else await apiService.examSetup.observationTypes.create(payload);
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
    setForm({ name: row.name || "", description: row.description || "" });
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete observation type "${row.name}"?`)) return;
    setActionError("");
    try {
      await apiService.examSetup.observationTypes.remove(row.id);
      if (editingId === row.id) reset();
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  const columns = [
    { header: "Observation Type", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Description", accessor: "description", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.description || "-"}</span> },
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
            <Plus size={18} className="text-slate-600" /> {editingId ? "Edit Observation Type" : "Add Observation Type"}
          </h3>
          <form className="space-y-4" onSubmit={submit}>
            {actionError && <Notice tone="error">{actionError}</Notice>}
            <div className="space-y-2">
              <label className={labelClass}>Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Description</label>
              <textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-none`} />
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Type" : "Save Type"}
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
            <h3 className="font-black text-slate-900 tracking-tight">Observation Types</h3>
          </div>
          <LoadState loading={loading} error={error} onRetry={reload} />
          {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} actions={actions} /> : <EmptyState>No observation types found.</EmptyState>)}
        </div>
      </div>
    </div>
  );
};

export default ObservationType;
