import React, { useState } from "react";
import { Plus, Save } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage, inputClass, labelClass } from "./ModuleState";

const emptyForm = { name: "", description: "", startDate: "", endDate: "", classId: "" };

const ExamSchedule = () => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const { data, loading, error, reload } = useAsync(async () => {
    const [exams, classes] = await Promise.all([apiService.exams.list(), apiService.getAllClasses()]);
    return { exams, classes };
  });
  const exams = data?.exams || [];
  const classes = data?.classes || [];
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiService.exams.create({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        classId: form.classId ? Number(form.classId) : undefined,
      });
      setForm(emptyForm);
      setMessage({ tone: "success", text: "Exam saved." });
      await reload();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const className = (id) => classes.find((c) => c.id === id)?.name || "-";

  const columns = [
    { header: "Exam Title", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Class", accessor: "classId", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.class?.name || className(row.classId)}</span> },
    { header: "Start", accessor: "startDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.startDate || "-"}</span> },
    { header: "End", accessor: "endDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.endDate || "-"}</span> },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
            <Plus size={18} className="text-indigo-600" /> Schedule Exam
          </h3>
          <form className="space-y-4" onSubmit={submit}>
            {message && <Notice tone={message.tone}>{message.text}</Notice>}
            <div className="space-y-2">
              <label className={labelClass}>Exam Title *</label>
              <input required type="text" className={inputClass} value={form.name} onChange={set("name")} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Class</label>
              <select className={inputClass} value={form.classId} onChange={set("classId")}>
                <option value="">All / unspecified</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Start Date</label>
              <input type="date" className={inputClass} value={form.startDate} onChange={set("startDate")} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>End Date</label>
              <input type="date" min={form.startDate} className={inputClass} value={form.endDate} onChange={set("endDate")} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Description</label>
              <textarea rows="3" className={`${inputClass} resize-none`} value={form.description} onChange={set("description")} />
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
              <Save size={18} /> {saving ? "Saving..." : "Save Exam"}
            </button>
          </form>
        </div>
      </div>

      <div className="xl:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Scheduled Exams</h3>
          </div>
          <LoadState loading={loading} error={error} onRetry={reload} />
          {!loading && !error && (exams.length ? <DataTable columns={columns} data={exams} /> : <EmptyState>No exams scheduled.</EmptyState>)}
        </div>
      </div>
    </div>
  );
};

export default ExamSchedule;
