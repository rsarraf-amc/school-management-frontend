import React, { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import DataTable from "../../ui/DataTable";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";
import { LoadState, EmptyState, Notice, errorMessage } from "../exam/ModuleState";

const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none disabled:opacity-60";

const AssignSubjects = () => {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const { data, loading, error } = useAsync(async () => {
    const [classes, subjects, teachers] = await Promise.all([
      apiService.getAllClasses(),
      apiService.timetable.subjects.list(),
      apiService.getAllTeachers(),
    ]);
    return { classes, subjects, teachers };
  }, { classes: [], subjects: [], teachers: [] });
  const assignments = useAsync(
    () => (classId ? apiService.academics.classSubjects.list({ classId }) : Promise.resolve([])),
    [],
  );
  const rows = assignments.data || [];

  const { reload: reloadAssignments } = assignments;
  useEffect(() => {
    reloadAssignments();
  }, [classId, reloadAssignments]);

  const refresh = () => assignments.reload();

  const submit = async (e) => {
    e.preventDefault();
    if (!classId) {
      setActionError("Select a class first.");
      return;
    }
    setSaving(true);
    setActionError("");
    try {
      await apiService.academics.classSubjects.create({
        classId,
        subjectId,
        teacherId: teacherId || undefined,
      });
      setSubjectId("");
      setTeacherId("");
      await refresh();
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Remove ${row.subject?.name || "this subject"} from this class?`)) return;
    setActionError("");
    try {
      await apiService.academics.classSubjects.remove(row.id);
      await refresh();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  const columns = [
    { header: "Class", accessor: "class", render: (row) => row.class?.name || "-" },
    { header: "Subject", accessor: "subject", render: (row) => <span className="font-bold text-slate-900">{row.subject?.name || "-"}</span> },
    { header: "Teacher", accessor: "teacher", render: (row) => row.teacher?.name || "-" },
  ];

  return (
    <div className="space-y-6">
      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

      <FilterBar
        title="Assign Subjects to Class"
        description="Select class to manage subject-teacher mapping."
        onFilter={refresh}
        onReset={() => setClassId("")}
      >
        <FilterItem label="Class *">
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className={selectClass}>
            <option value="">{loading ? "Loading..." : "Select Class"}</option>
            {data.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FilterItem>
      </FilterBar>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <h3 className="font-black text-slate-900 tracking-tight">Assigned Subjects List</h3>
            </div>
            {!classId ? (
              <EmptyState>Select a class to view its subjects.</EmptyState>
            ) : (
              <>
                <LoadState loading={assignments.loading} error={assignments.error} onRetry={assignments.reload} />
                {!assignments.loading && !assignments.error && (rows.length
                  ? <DataTable columns={columns} data={rows} actions={[{ icon: Trash2, label: "Remove", variant: "danger", onClick: remove }]} />
                  : <EmptyState>No assignments to display.</EmptyState>)}
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-100 bg-blue-50/30">
              <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                Add Subject Mapping
              </h3>
            </div>
            <form className="p-6 space-y-4" onSubmit={submit}>
              {actionError && <Notice tone="error">{actionError}</Notice>}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Subject *</label>
                <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className={selectClass}>
                  <option value="">Select Subject</option>
                  {data.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Teacher</label>
                <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className={selectClass}>
                  <option value="">Select Teacher</option>
                  {data.teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <button type="submit" disabled={saving} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> {saving ? "Saving..." : "Assign Subject"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjects;
