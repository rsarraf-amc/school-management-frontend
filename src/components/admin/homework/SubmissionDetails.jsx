import React, { useState } from "react";
import { Save, CheckCircle, Trash2, UserPlus } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState } from "../transport/TransportState";

const select = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none";
const fullName = (s) => [s?.firstName, s?.lastName].filter(Boolean).join(" ");

const SubmissionDetails = () => {
  const { data: lookups, loading, error } = useAsync(async () => {
    const [homework, classes, subjects, students] = await Promise.all([
      apiService.homework.list(),
      apiService.getAllClasses(),
      apiService.timetable.subjects.list(),
      apiService.getAllStudents(),
    ]);
    return { homework, classes, subjects, students };
  }, null);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [homeworkId, setHomeworkId] = useState("");
  const [activeHomeworkId, setActiveHomeworkId] = useState("");
  const [records, setRecords] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [newStudentId, setNewStudentId] = useState("");

  const classes = lookups?.classes || [];
  const subjects = lookups?.subjects || [];
  const students = lookups?.students || [];
  const homeworkOptions = (lookups?.homework || []).filter(
    (h) => (!classId || String(h.classId ?? h.class?.id) === classId) && (!subjectId || String(h.subjectId ?? h.subject?.id) === subjectId)
  );

  const loadRecords = async (id) => {
    setLoadingRecords(true);
    setActionError("");
    try {
      const list = await apiService.homework.submissions.list({ homeworkId: id });
      setRecords(list);
      setDrafts({});
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleFilter = () => {
    setMessage("");
    if (!homeworkId) {
      setActionError("Select a homework to view its submissions.");
      return;
    }
    setActiveHomeworkId(homeworkId);
    loadRecords(homeworkId);
  };

  const handleReset = () => {
    setClassId("");
    setSubjectId("");
    setHomeworkId("");
    setActiveHomeworkId("");
    setRecords([]);
    setDrafts({});
    setActionError("");
    setMessage("");
  };

  const valueOf = (row, key) => drafts[row.id]?.[key] ?? row[key] ?? "";
  const setDraft = (row, key, value) =>
    setDrafts((d) => ({ ...d, [row.id]: { ...d[row.id], [key]: value } }));

  const handleSave = async () => {
    const changed = Object.keys(drafts);
    if (changed.length === 0) {
      setMessage("No changes to save.");
      return;
    }
    setSaving(true);
    setActionError("");
    setMessage("");
    try {
      for (const id of changed) {
        const row = records.find((r) => String(r.id) === id);
        const d = drafts[id];
        const marks = d.marks ?? row.marks;
        await apiService.homework.submissions.update(row.id, {
          status: d.status ?? row.status,
          marks: marks === "" || marks == null ? null : Number(marks),
          remark: (d.remark ?? row.remark ?? "") || null,
        });
      }
      await loadRecords(activeHomeworkId);
      setMessage("Evaluation saved.");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!newStudentId) return;
    setActionError("");
    setMessage("");
    try {
      await apiService.homework.submissions.create({
        homeworkId: Number(activeHomeworkId),
        studentId: Number(newStudentId),
        status: "Submitted",
      });
      setNewStudentId("");
      await loadRecords(activeHomeworkId);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Remove this submission?")) return;
    try {
      await apiService.homework.submissions.remove(row.id);
      await loadRecords(activeHomeworkId);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { header: "Admission No", render: (row) => <span className="font-bold text-slate-900">{row.student?.admissionNumber || "—"}</span> },
    { header: "Student Name", render: (row) => <span className="font-bold text-slate-700">{fullName(row.student) || "—"}</span> },
    {
      header: "Status",
      render: (row) => (
        <div className="flex items-center gap-2">
          {["Submitted", "Evaluated"].map((status) => (
            <label key={status} className="flex items-center gap-1 cursor-pointer group">
              <input
                type="radio"
                name={`status-${row.id}`}
                checked={valueOf(row, "status") === status}
                onChange={() => setDraft(row, "status", status)}
                className="hidden"
              />
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                valueOf(row, "status") === status
                  ? status === "Evaluated" ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100"
                  : "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-100"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
              }`}>
                {status}
              </span>
            </label>
          ))}
        </div>
      )
    },
    {
      header: "Evaluation Note",
      render: (row) => (
        <input
          type="text"
          placeholder="Teacher's remark..."
          value={valueOf(row, "remark")}
          onChange={(e) => setDraft(row, "remark", e.target.value)}
          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20"
        />
      )
    },
    {
      header: "Marks",
      render: (row) => (
        <input
          type="number"
          min="0"
          placeholder="e.g. 8"
          value={valueOf(row, "marks")}
          onChange={(e) => setDraft(row, "marks", e.target.value)}
          className="w-20 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:ring-2 focus:ring-emerald-500/20"
        />
      )
    }
  ];

  const actions = [{ icon: Trash2, label: "Remove", variant: "danger", onClick: handleDelete }];

  return (
    <div className="space-y-6">
      <LoadState loading={loading} error={error} />
      <FilterBar
         title="Evaluate Submissions"
         description="Filter by Class and Subject, then pick a homework to evaluate."
         onFilter={handleFilter}
         onReset={handleReset}
      >
        <FilterItem label="Class">
           <select value={classId} onChange={(e) => { setClassId(e.target.value); setHomeworkId(""); }} className={select}>
              <option value="">All classes</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
           </select>
        </FilterItem>
        <FilterItem label="Subject">
           <select value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setHomeworkId(""); }} className={select}>
              <option value="">All subjects</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
           </select>
        </FilterItem>
        <FilterItem label="Homework *">
           <select value={homeworkId} onChange={(e) => setHomeworkId(e.target.value)} className={select}>
              <option value="">Select homework</option>
              {homeworkOptions.map((h) => <option key={h.id} value={h.id}>{h.title} ({h.class?.name})</option>)}
           </select>
        </FilterItem>
      </FilterBar>

      {activeHomeworkId && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-600" />
              Student Submissions
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <select value={newStudentId} onChange={(e) => setNewStudentId(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium">
                <option value="">Record submission for...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.admissionNumber} - {fullName(s)}</option>
                ))}
              </select>
              <button type="button" onClick={handleAdd} disabled={!newStudentId} className="px-4 py-2.5 bg-slate-800 text-white rounded-2xl font-bold text-sm flex items-center gap-2 disabled:opacity-50">
                <UserPlus size={16} /> Add
              </button>
              <button type="button" onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2 disabled:opacity-60">
                <Save size={18} /> {saving ? "Saving..." : "Save Evaluation"}
              </button>
            </div>
          </div>
          {loadingRecords ? <LoadState loading /> : <DataTable columns={columns} data={records} actions={actions} />}
        </div>
      )}
      <FormMessage error={actionError} />
      {message && <p className="text-xs font-medium text-emerald-600">{message}</p>}
    </div>
  );
};

export default SubmissionDetails;
