import React, { useState } from "react";
import { Calendar, Plus, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage } from "../exam/ModuleState";

const columns = [
  { header: "Holiday Name", accessor: "title" },
  { header: "From", accessor: "startDate", render: (row) => String(row.startDate || "").slice(0, 10) },
  { header: "To", accessor: "endDate", render: (row) => (row.endDate ? String(row.endDate).slice(0, 10) : "-") },
  { header: "Description", accessor: "description", render: (row) => row.description || "-" },
];

const field = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium disabled:opacity-60";
const emptyForm = { title: "", startDate: "", endDate: "", description: "" };

const HolidayManagement = () => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(() => apiService.academics.holidays.list(), []);
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
        title: form.title.trim(),
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        description: form.description.trim() || undefined,
      };
      if (editingId) await apiService.academics.holidays.update(editingId, payload);
      else await apiService.academics.holidays.create(payload);
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
      title: row.title || "",
      startDate: row.startDate ? String(row.startDate).slice(0, 10) : "",
      endDate: row.endDate ? String(row.endDate).slice(0, 10) : "",
      description: row.description || "",
    });
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete holiday "${row.title}"?`)) return;
    setActionError("");
    try {
      await apiService.academics.holidays.remove(row.id);
      if (editingId === row.id) reset();
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  const actions = [
    { icon: Edit, label: "Edit", onClick: startEdit },
    { icon: Trash2, label: "Delete", variant: "danger", onClick: remove },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Academic Calendar - Holidays</h3>
          </div>
          <LoadState loading={loading} error={error} onRetry={reload} />
          {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} actions={actions} /> : <EmptyState>No holidays to display.</EmptyState>)}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div className="p-6 border-b border-slate-100 bg-rose-50/30">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Plus size={18} className="text-rose-600" />
              {editingId ? "Edit Holiday" : "Add Holiday"}
            </h3>
          </div>
          <form className="p-6 space-y-4" onSubmit={submit}>
            {actionError && <Notice tone="error">{actionError}</Notice>}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Holiday Title *</label>
              <input type="text" required value={form.title} onChange={set("title")} className={field} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">From *</label>
                <input type="date" required value={form.startDate} onChange={set("startDate")} className={field} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">To</label>
                <input type="date" value={form.endDate} min={form.startDate || undefined} onChange={set("endDate")} className={field} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
              <textarea rows="4" value={form.description} onChange={set("description")} className={`${field} resize-none`} />
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
              <Calendar size={18} /> {saving ? "Saving..." : editingId ? "Update Holiday" : "Save Holiday"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="w-full text-xs font-bold text-slate-500 underline">Cancel edit</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HolidayManagement;
