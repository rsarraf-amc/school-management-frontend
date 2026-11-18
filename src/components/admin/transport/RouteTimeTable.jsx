import React, { useState } from "react";
import { Plus, Calendar, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState, inputClass } from "./TransportState";

const emptyForm = { routeId: "", trip: "Morning", departureTime: "", arrivalTime: "" };
const labelCls = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";
const hhmm = (v) => (v ? String(v).slice(0, 5) : "");

const RouteTimeTable = () => {
  const { data: routes } = useAsync(() => apiService.transport.routes.list(), []);
  const { data, loading, error, reload } = useAsync(() => apiService.transport.schedules.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const schedules = data || [];
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.routeId || !form.departureTime) {
      setFormError("Route and departure time are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      routeId: Number(form.routeId),
      trip: form.trip,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime || null,
    };
    try {
      if (editingId) await apiService.transport.schedules.update(editingId, payload);
      else await apiService.transport.schedules.create(payload);
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
      routeId: row.routeId ?? row.route?.id ?? "",
      trip: row.trip || "Morning",
      departureTime: hhmm(row.departureTime),
      arrivalTime: hhmm(row.arrivalTime),
    });
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this timetable entry?")) return;
    try {
      await apiService.transport.schedules.remove(row.id);
      if (editingId === row.id) resetForm();
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Route", accessor: "route", render: (r) => r.route?.routeName || "—" },
    { header: "Trip", accessor: "trip" },
    { header: "Departure Time", accessor: "departureTime", render: (r) => hhmm(r.departureTime) || "—" },
    { header: "Arrival Time", accessor: "arrivalTime", render: (r) => hhmm(r.arrivalTime) || "—" },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: handleEdit },
    { icon: Trash2, label: "Delete", onClick: handleDelete },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8 space-y-4">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar size={18} className="text-slate-600" /> {editingId ? "Edit TimeTable" : "Route TimeTable"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className={labelCls}>Route *</label>
              <select value={form.routeId} onChange={setField("routeId")} className={inputClass}>
                <option value="">Select Route</option>
                {(routes || []).map((r) => <option key={r.id} value={r.id}>{r.routeName}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>Trip</label>
              <select value={form.trip} onChange={setField("trip")} className={inputClass}>
                {["Morning", "Afternoon", "Evening"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className={labelCls}>Departure *</label>
                <input type="time" value={form.departureTime} onChange={setField("departureTime")} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Arrival</label>
                <input type="time" value={form.arrivalTime} onChange={setField("arrivalTime")} className={inputClass} />
              </div>
            </div>
            <FormMessage error={formError} />
            <button type="submit" disabled={saving} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update TimeTable" : "Save TimeTable"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="w-full py-3 text-sm font-bold text-slate-500">Cancel edit</button>
            )}
          </form>
        </div>
      </div>

      <div className="xl:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">TimeTable List</h3>
          </div>
          <LoadState loading={loading} error={error} />
          {!loading && !error && <DataTable columns={columns} data={schedules} actions={actions} />}
        </div>
      </div>
    </div>
  );
};

export default RouteTimeTable;
