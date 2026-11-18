import React, { useEffect, useState } from "react";
import { Plus, Calendar, Trash2 } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium";
const emptyForm = { dayOfWeek: "Monday", subjectId: "", teacherId: "", startTime: "", endTime: "", room: "" };
const hhmm = (t) => String(t || "").slice(0, 5);

const TimeTableManagement = () => {
  const [classId, setClassId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: lookups, loading, error } = useAsync(async () => {
    const [classes, subjects, teachers] = await Promise.all([
      apiService.getAllClasses(),
      apiService.timetable.subjects.list(),
      apiService.getAllTeachers(),
    ]);
    return { classes, subjects, teachers };
  }, { classes: [], subjects: [], teachers: [] });

  const loadEntries = async (id) => {
    if (!id) { setEntries([]); return; }
    setEntriesLoading(true);
    setEntriesError("");
    try {
      setEntries(await apiService.timetable.list({ ClassId: id }));
    } catch (e) {
      setEntriesError(e.message);
    } finally {
      setEntriesLoading(false);
    }
  };

  useEffect(() => { loadEntries(classId); }, [classId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      await apiService.timetable.create({
        ClassId: Number(classId),
        SubjectId: Number(form.subjectId),
        TeacherId: form.teacherId ? Number(form.teacherId) : null,
        DayOfWeek: form.dayOfWeek,
        StartTime: form.startTime,
        EndTime: form.endTime,
        Room: form.room || null,
      });
      setForm({ ...emptyForm, dayOfWeek: form.dayOfWeek });
      await loadEntries(classId);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm("Delete this period?")) return;
    setActionError("");
    try {
      await apiService.timetable.remove(entry.id);
      await loadEntries(classId);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const days = DAYS.map((day) => ({
    day,
    periods: entries.filter((p) => p.dayOfWeek === day).sort((a, b) => String(a.startTime).localeCompare(String(b.startTime))),
  })).filter((d) => d.periods.length);

  return (
    <div className="space-y-6">
      <FilterBar title="Timetable Viewer" description="Select a class to view or manage the weekly schedule." onFilter={() => loadEntries(classId)} onReset={() => setClassId("")}>
        <FilterItem label="Class">
          <select className={`${inputClass} appearance-none`} value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">{loading ? "Loading..." : "Select Class"}</option>
            {lookups.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FilterItem>
      </FilterBar>

      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

      {classId && (
        <form onSubmit={handleAdd} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h4 className="font-black text-slate-900 tracking-tight flex items-center gap-2"><Plus size={18} className="text-indigo-600" /> Add Period</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select className={inputClass} value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select required className={inputClass} value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
              <option value="">Subject *</option>
              {lookups.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select className={inputClass} value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
              <option value="">Teacher</option>
              {lookups.teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input required type="time" className={inputClass} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <input required type="time" className={inputClass} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            <input type="text" placeholder="Room" className={inputClass} value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
          </div>
          {!lookups.subjects.length && <p className="text-xs font-bold text-amber-600">Add subjects first in Subject Management.</p>}
          {actionError && <p className="text-xs font-bold text-rose-600">{actionError}</p>}
          <button type="submit" disabled={saving} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50">
            {saving ? "Adding..." : "Add Period"}
          </button>
        </form>
      )}

      {!classId ? (
        <div className="p-8 text-center text-sm font-medium text-slate-500">Select a class to view its timetable.</div>
      ) : entriesLoading ? (
        <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>
      ) : entriesError ? (
        <div className="p-8 text-center text-sm font-medium text-rose-600">{entriesError}</div>
      ) : !days.length ? (
        <div className="p-8 text-center text-sm font-medium text-slate-500">No periods scheduled for this class.</div>
      ) : (
        <div className="grid gap-6">
          {days.map((dayData) => (
            <div key={dayData.day} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-600" />
                  {dayData.day}
                </h4>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dayData.periods.map((period) => (
                  <div key={period.id} className="p-4 rounded-2xl border bg-indigo-50/50 border-indigo-100 group relative">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{hhmm(period.startTime)} - {hhmm(period.endTime)}</p>
                    <p className="font-bold text-slate-900">{period.subject?.name || "-"}</p>
                    <p className="text-xs text-slate-500 font-medium">{period.teacher?.name || "No teacher"}{period.room ? ` · ${period.room}` : ""}</p>
                    <button onClick={() => handleDelete(period)} className="absolute top-2 right-2 p-1.5 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeTableManagement;
