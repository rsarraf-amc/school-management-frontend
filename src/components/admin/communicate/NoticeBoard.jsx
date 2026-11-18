import React, { useState } from "react";
import { Save, Edit, Trash2, Megaphone } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState } from "../transport/TransportState";

const AUDIENCES = ["All", "Students", "Teachers", "Staff"];
const field = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20";
const fmt = (d) => (d ? String(d).slice(0, 10) : "");
const emptyForm = () => ({ title: "", publishDate: new Date().toISOString().slice(0, 10), audience: "All", message: "" });

const NoticeBoard = () => {
  const { data, loading, error, reload } = useAsync(() => apiService.communicate.notices.list(), []);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const notices = data || [];
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setFormError("Title and message are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      audience: form.audience,
      publishDate: form.publishDate || undefined,
    };
    try {
      if (editingId) await apiService.communicate.notices.update(editingId, payload);
      else await apiService.communicate.notices.create(payload);
      resetForm();
      await reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormError("");
    setForm({
      title: row.title || "",
      publishDate: fmt(row.publishDate),
      audience: row.audience || "All",
      message: row.message || "",
    });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete notice "${row.title}"?`)) return;
    try {
      await apiService.communicate.notices.remove(row.id);
      if (editingId === row.id) resetForm();
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Title", accessor: "title", render: (row) => (
      <div>
        <span className="font-bold text-slate-900">{row.title}</span>
        <p className="text-xs text-slate-500 font-medium line-clamp-2">{row.message}</p>
      </div>
    )},
    { header: "Publish Date", accessor: "publishDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{fmt(row.publishDate) || "—"}</span> },
    {
      header: "Visible To",
      accessor: "audience",
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600">
          {row.audience}
        </span>
      )
    },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: handleEdit },
    { icon: Trash2, label: "Delete", variant: "danger", onClick: handleDelete },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Post Notice Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Megaphone size={18} className="text-indigo-600" /> {editingId ? "Edit Notice" : "Post New Notice"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Title *</label>
                <input type="text" value={form.title} onChange={setField("title")} className={field} />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Publish Date</label>
                <input type="date" value={form.publishDate} onChange={setField("publishDate")} className={field} />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Visible To *</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {AUDIENCES.map((target) => (
                    <label key={target} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
                      <input
                        type="radio"
                        name="audience"
                        checked={form.audience === target}
                        onChange={() => setForm((f) => ({ ...f, audience: target }))}
                        className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-slate-600 uppercase">{target}</span>
                    </label>
                  ))}
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Message *</label>
                <textarea rows="4" value={form.message} onChange={setField("message")} className={`${field} resize-none`}></textarea>
             </div>
             <FormMessage error={formError} />
             <button type="submit" disabled={saving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
                <Save size={18} /> {saving ? "Saving..." : editingId ? "Update Notice" : "Publish Notice"}
             </button>
             {editingId && (
               <button type="button" onClick={resetForm} className="w-full py-3 text-sm font-bold text-slate-500">Cancel edit</button>
             )}
          </form>
        </div>
      </div>

      {/* Notice List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Recent Notices</h3>
            </div>
            <LoadState loading={loading} error={error} />
            {!loading && !error && <DataTable columns={columns} data={notices} actions={actions} />}
         </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
