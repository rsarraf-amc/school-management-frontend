import React, { useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";

const SubjectManagement = () => {
  const { data: subjects, loading, error, reload } = useAsync(() => apiService.timetable.subjects.list(), []);
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      await apiService.timetable.subjects.create({ Name: formData.name.trim(), Code: formData.code.trim() || null });
      setFormData({ name: "", code: "" });
      await reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete subject ${row.name}?`)) return;
    setActionError("");
    try {
      await apiService.timetable.subjects.remove(row.id);
      await reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { header: "Subject Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Subject Code", accessor: "code", render: (row) => row.code ? <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{row.code}</span> : <span className="text-slate-400">-</span> },
    { header: "Actions", render: (row) => <button onClick={() => handleDelete(row)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Subject List</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-sm font-medium text-rose-600">{error}</div>
          ) : !subjects.length ? (
            <div className="p-8 text-center text-sm font-medium text-slate-500">No subjects yet. Add one using the form.</div>
          ) : (
            <DataTable columns={columns} data={subjects} />
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div className="p-6 border-b border-slate-100 bg-emerald-50/30">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-600" />
              Add Subject
            </h3>
          </div>
          <form onSubmit={handleAdd} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject Name *</label>
              <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject Code</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </div>
            {actionError && <p className="text-xs font-bold text-rose-600">{actionError}</p>}
            <button type="submit" disabled={saving} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
              <Plus size={18} /> {saving ? "Adding..." : "Add Subject"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubjectManagement;
