import { useState } from "react";
import { AlertCircle, Edit2, Loader2, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import SectionCard from "../../ui/SectionCard";
import SlideOver from "../../ui/SlideOver";
import useAsync from "../../../hooks/useAsync";

export const fieldClass =
  "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20";
export const filterClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all";
export const labelClass = "text-[11px] font-black text-slate-500 uppercase tracking-widest";

export function LoadState({ loading, error }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-rose-600">
        <AlertCircle size={16} /> {error}
      </div>
    );
  }
  return null;
}

const toFormValue = (field, value) => {
  if (value === null || value === undefined) return field.default ?? "";
  return field.type === "date" ? String(value).slice(0, 10) : String(value);
};

export function CrudRegister({ title, entity, api, listParams, createExtra, columns, fields }) {
  const { data, loading, error, reload } = useAsync(() => api.list(listParams), []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");

  const emptyForm = () => Object.fromEntries(fields.map((f) => [f.key, toFormValue(f, null)]));

  const openForm = (row) => {
    setFormError("");
    setEditingId(row ? row.id : null);
    setForm(row ? Object.fromEntries(fields.map((f) => [f.key, toFormValue(f, row[f.key])])) : emptyForm());
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const payload = { ...createExtra };
    fields.forEach((f) => {
      const value = String(form[f.key] ?? "").trim();
      payload[f.key] = f.required ? value : value || null;
    });
    try {
      if (editingId) await api.update(editingId, payload);
      else await api.create(payload);
      setIsFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const actions = [
    { label: "Edit Entry", icon: Edit2, onClick: (row) => openForm(row) },
    {
      label: "Delete Entry",
      icon: Trash2,
      variant: "danger",
      onClick: async (row) => {
        if (!window.confirm(`Delete this ${entity}?`)) return;
        setActionError("");
        try {
          await api.remove(row.id);
          await reload();
        } catch (err) {
          setActionError(err.message);
        }
      },
    },
  ];

  const rows = data || [];

  return (
    <div className="space-y-6">
      <SectionCard title={title} count={rows.length} onAdd={() => openForm(null)} addLabel={`Add ${entity}`}>
        {actionError && <p className="px-6 py-3 text-xs font-medium text-rose-600">{actionError}</p>}
        <LoadState loading={loading} error={error} />
        {!loading && !error && <DataTable columns={columns} data={rows} actions={actions} />}
      </SectionCard>

      <SlideOver isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={`${editingId ? "Edit" : "Add"} ${entity}`}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div key={f.key} className="space-y-1">
              <label className={labelClass}>{f.label}{f.required ? " *" : ""}</label>
              {f.options ? (
                <select required={f.required} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={fieldClass}>
                  {f.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : f.type === "textarea" ? (
                <textarea rows="3" value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={`${fieldClass} resize-none`} />
              ) : (
                <input type={f.type || "text"} required={f.required} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className={fieldClass} />
              )}
            </div>
          ))}
          {formError && <p className="text-xs font-medium text-rose-600">{formError}</p>}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-60">
              {saving ? "Saving..." : `Save ${entity}`}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}

export const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "—");
export const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";
export const localDateKey = (value) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
