import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState } from "../transport/TransportState";

const field = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium";
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (d) => (d ? String(d).slice(0, 10) : "");
const emptyForm = () => ({ classId: "", subjectId: "", homeworkDate: today(), submissionDate: "", description: "", title: "" });

const AddHomework = () => {
  const { data, loading, error, reload } = useAsync(async () => {
    const [homework, classes, subjects, submissions] = await Promise.all([
      apiService.homework.list(),
      apiService.getAllClasses(),
      apiService.timetable.subjects.list(),
      apiService.homework.submissions.list(),
    ]);
    return { homework, classes, subjects, submissions };
  }, null);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const homeworkList = data?.homework || [];
  const classes = data?.classes || [];
  const subjects = data?.subjects || [];
  const submissions = data?.submissions || [];
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classId || !form.subjectId || !form.title.trim() || !form.homeworkDate || !form.submissionDate) {
      setFormError("Class, subject, title, homework date and submission date are required.");
      return;
    }
    if (form.submissionDate < form.homeworkDate) {
      setFormError("Submission date cannot be before homework date.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      classId: Number(form.classId),
      subjectId: Number(form.subjectId),
      title: form.title.trim(),
      description: form.description.trim() || null,
      homeworkDate: form.homeworkDate,
      submissionDate: form.submissionDate,
    };
    try {
      if (editingId) await apiService.homework.update(editingId, payload);
      else await apiService.homework.create(payload);
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
      classId: String(row.classId ?? row.class?.id ?? ""),
      subjectId: String(row.subjectId ?? row.subject?.id ?? ""),
      title: row.title || "",
      homeworkDate: fmt(row.homeworkDate),
      submissionDate: fmt(row.submissionDate),
      description: row.description || "",
    });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete homework "${row.title}"?`)) return;
    try {
      await apiService.homework.remove(row.id);
      if (editingId === row.id) resetForm();
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Class", render: (row) => <span className="font-bold text-slate-900">{row.class?.name || "—"}</span> },
    { header: "Title", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.title}</span> },
    { header: "Subject", render: (row) => <span className="font-bold text-slate-700">{row.subject?.name || "—"}</span> },
    { header: "Homework Date", render: (row) => <span className="text-slate-500 font-medium text-xs">{fmt(row.homeworkDate) || "—"}</span> },
    { header: "Submission Date", render: (row) => <span className="text-slate-500 font-medium text-xs">{fmt(row.submissionDate) || "—"}</span> },
    { header: "Status", render: (row) => {
      const mine = submissions.filter((s) => (s.homeworkId ?? s.homework?.id) === row.id);
      const evaluated = mine.filter((s) => s.status === "Evaluated").length;
      return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          mine.length > 0 && evaluated === mine.length ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
        }`}>
          {mine.length} submitted{evaluated ? `, ${evaluated} evaluated` : ""}
        </span>
      );
    }},
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: handleEdit },
    { icon: Trash2, label: "Delete", variant: "danger", onClick: handleDelete },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Add Homework Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Plus size={18} className="text-indigo-600" /> {editingId ? "Edit Homework" : "Add Homework"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Class *</label>
                <select value={form.classId} onChange={setField("classId")} className={`${field} appearance-none`}>
                   <option value="">Select class</option>
                   {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Subject *</label>
                <select value={form.subjectId} onChange={setField("subjectId")} className={`${field} appearance-none`}>
                   <option value="">Select subject</option>
                   {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Title *</label>
                <input type="text" value={form.title} onChange={setField("title")} className={field} />
             </div>
             <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Homework Date *</label>
                   <input type="date" value={form.homeworkDate} onChange={setField("homeworkDate")} className={field} />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Submission Date *</label>
                   <input type="date" value={form.submissionDate} min={form.homeworkDate} onChange={setField("submissionDate")} className={field} />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <textarea rows="4" value={form.description} onChange={setField("description")} className={`${field} resize-none`}></textarea>
             </div>
             <FormMessage error={formError} />
             <button type="submit" disabled={saving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
                <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Homework" : "Save Homework"}
             </button>
             {editingId && (
               <button type="button" onClick={resetForm} className="w-full py-3 text-sm font-bold text-slate-500">Cancel edit</button>
             )}
          </form>
        </div>
      </div>

      {/* Homework List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Homework List</h3>
            </div>
            <LoadState loading={loading} error={error} />
            {!loading && !error && <DataTable columns={columns} data={homeworkList} actions={actions} />}
         </div>
      </div>
    </div>
  );
};

export default AddHomework;
