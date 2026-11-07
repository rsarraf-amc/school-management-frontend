import React, { useState } from "react";
import { Plus, Clock, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useApiData from "../../../hooks/useApiData";
import { shiftsApi } from "../../../services/api";
import { shiftFromApi } from "../../../utils/mappers";

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20";
const emptyForm = { name: "", startTime: "", endTime: "", description: "" };

// <input type="time"> yields HH:mm; the backend expects HH:mm:ss.
const toApiTime = (value) => (value.length === 5 ? `${value}:00` : value);
const shortTime = (value) => (value ? String(value).slice(0, 5) : "-");

const ShiftManagement = () => {
  const { data: shifts, loading, error, reload } = useApiData(
    async () => (await shiftsApi.list()).map(shiftFromApi),
    [],
    []
  );
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      await shiftsApi.create({
        shiftName: form.name.trim(),
        startTime: toApiTime(form.startTime),
        endTime: toApiTime(form.endTime),
        description: form.description.trim() || undefined,
      });
      setForm(emptyForm);
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete shift "${row.name}"?`)) return;
    setActionError("");
    try {
      await shiftsApi.remove(row.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
           <h3 className="font-black text-slate-900 tracking-tight">Shift Setup</h3>
         </div>
         {loading && <p className="p-6 text-sm font-medium text-slate-500">Loading shifts...</p>}
         {error && <p className="p-6 text-sm font-bold text-rose-600">{error}</p>}
         {!loading && !error && (
           <DataTable
             columns={[
               { header: "Shift Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
               { header: "Time From", accessor: "startTime", render: (row) => <span className="text-slate-500 font-medium">{shortTime(row.startTime)}</span> },
               { header: "Time To", accessor: "endTime", render: (row) => <span className="text-slate-500 font-medium">{shortTime(row.endTime)}</span> },
             ]}
             data={shifts}
             actions={[{ icon: Trash2, label: "Delete", variant: "danger", onClick: handleDelete }]}
           />
         )}
      </div>
      <div className="lg:col-span-1">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4"><Clock size={18} className="text-slate-600"/> Add Shift</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Name *</label>
                  <input type="text" required value={form.name} onChange={setField("name")} className={inputClass} />
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Time From *</label>
                     <input type="time" required value={form.startTime} onChange={setField("startTime")} className={inputClass} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Time To *</label>
                     <input type="time" required value={form.endTime} onChange={setField("endTime")} className={inputClass} />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <input type="text" value={form.description} onChange={setField("description")} className={inputClass} />
               </div>
               {actionError && <p className="text-sm font-bold text-rose-600">{actionError}</p>}
               <button type="submit" disabled={saving} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"><Plus size={18} /> {saving ? "Saving..." : "Save"}</button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default ShiftManagement;
