import React, { useMemo, useState } from "react";
import { UserPlus, Save } from "lucide-react";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState, inputClass } from "./TransportState";

const label = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";
const studentName = (s) => [s.firstName, s.lastName].filter(Boolean).join(" ");

const AssignStudentTransport = () => {
  const { data, loading, error, reload } = useAsync(async () => {
    const [students, routes, assignments] = await Promise.all([
      apiService.getAllStudents(),
      apiService.transport.routes.list(),
      apiService.transport.assignments.list(),
    ]);
    return { students, routes, assignments };
  }, { students: [], routes: [], assignments: [] });
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [studentId, setStudentId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [pickupPoint, setPickupPoint] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const { students, routes, assignments } = data;
  const assignedIds = useMemo(() => new Set(assignments.map((a) => a.studentId)), [assignments]);
  const classOptions = useMemo(() => [...new Set(students.map((s) => s.class).filter(Boolean))].sort(), [students]);
  const sectionOptions = useMemo(
    () => [...new Set(students.filter((s) => !className || s.class === className).map((s) => s.section).filter(Boolean))].sort(),
    [students, className],
  );
  const studentOptions = students.filter(
    (s) => (!className || s.class === className) && (!section || s.section === section) && !assignedIds.has(s.id),
  );
  const selectedRoute = routes.find((r) => String(r.id) === routeId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !routeId) {
      setFormError("Select a student and a route.");
      return;
    }
    setSaving(true);
    setFormError("");
    setSuccess("");
    try {
      await apiService.transport.assignments.create({
        StudentId: studentId,
        RouteId: Number(routeId),
        PickupPoint: pickupPoint.trim() || null,
      });
      setStudentId("");
      setPickupPoint("");
      setSuccess("Transport assigned successfully.");
      await reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-amber-50/30">
        <UserPlus size={20} className="text-amber-600" />
        <h3 className="font-black text-slate-900 tracking-tight">Assign Student To Transport</h3>
      </div>
      <LoadState loading={loading} error={error} />
      {!loading && !error && (
        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={label}>Class</label>
              <select value={className} onChange={(e) => { setClassName(e.target.value); setSection(""); setStudentId(""); }} className={inputClass}>
                <option value="">All Classes</option>
                {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={label}>Section</label>
              <select value={section} onChange={(e) => { setSection(e.target.value); setStudentId(""); }} className={inputClass}>
                <option value="">All Sections</option>
                {sectionOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className={label}>Student *</label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputClass}>
                <option value="">Select Student</option>
                {studentOptions.map((s) => (
                  <option key={s.id} value={s.id}>{studentName(s)} ({s.admissionNumber})</option>
                ))}
              </select>
              {studentOptions.length === 0 && (
                <p className="text-xs text-slate-500 ml-1">No unassigned students found for this selection.</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={label}>Route *</label>
              <select value={routeId} onChange={(e) => setRouteId(e.target.value)} className={inputClass}>
                <option value="">Select Route</option>
                {routes.map((r) => <option key={r.id} value={r.id}>{r.routeName}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={label}>Vehicle</label>
              <input type="text" readOnly value={selectedRoute ? selectedRoute.vehicle?.vehicleNumber || "No vehicle on route" : ""} placeholder="Set by the selected route" className={inputClass} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className={label}>Pickup Point</label>
              <input type="text" value={pickupPoint} onChange={(e) => setPickupPoint(e.target.value)} className={inputClass} />
            </div>
          </div>

          <FormMessage error={formError} />
          {success && <p className="text-xs font-medium text-emerald-600">{success}</p>}

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={saving} className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm shadow-lg shadow-amber-100 flex items-center gap-2 disabled:opacity-60">
              <Save size={18} /> {saving ? "Saving..." : "Assign Transport"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AssignStudentTransport;
