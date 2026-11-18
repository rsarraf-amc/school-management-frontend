import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import StatusMessage from "../../ui/StatusMessage";
import useAsync from "../../../hooks/useAsync";

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20";

const emptyForm = (fields) => Object.fromEntries(fields.map((field) => [field.key, ""]));

export default function MasterDataPanel({ title, singular, icon: Icon, api, fields, columns }) {
  const { data, loading, error, setError, reload } = useAsync(() => api.list(), []);
  const [form, setForm] = useState(() => emptyForm(fields));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.create(form);
      setForm(emptyForm(fields));
      await reload();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete this ${singular.toLowerCase()}?`)) return;
    try {
      await api.remove(row.id);
      await reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">{title}</h3>
        </div>
        <StatusMessage loading={loading} error={error} empty={!loading && !error && data.length === 0} />
        {!loading && data.length > 0 && (
          <DataTable
            columns={columns}
            data={data}
            actions={[{ icon: Trash2, label: "Delete", variant: "danger", onClick: handleDelete }]}
          />
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4">
            <Icon size={18} className="text-slate-600" /> Add {singular}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                <input
                  type={field.type || "text"}
                  required={field.required}
                  value={form[field.key]}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}
                  className={inputClass}
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Plus size={18} /> {saving ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
