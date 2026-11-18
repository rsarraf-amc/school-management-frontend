import React, { useState } from "react";
import { Plus, Map, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState, inputClass } from "./TransportState";

const emptyForm = { routeName: "", startPoint: "", endPoint: "", fare: "" };

const RoutesManagement = () => {
  const { data, loading, error, reload } = useAsync(() => apiService.transport.routes.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const routes = data || [];
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.routeName.trim()) {
      setFormError("Route name is required.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      RouteName: form.routeName.trim(),
      StartPoint: form.startPoint.trim() || null,
      EndPoint: form.endPoint.trim() || null,
      Fare: form.fare === "" ? 0 : Number(form.fare),
    };
    try {
      if (editingId) await apiService.transport.routes.update(editingId, payload);
      else await apiService.transport.routes.create(payload);
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
      routeName: row.routeName || "",
      startPoint: row.startPoint || "",
      endPoint: row.endPoint || "",
      fare: row.fare ?? "",
    });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete route ${row.routeName}?`)) return;
    try {
      await apiService.transport.routes.remove(row.id);
      if (editingId === row.id) resetForm();
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Route", accessor: "routeName", render: (row) => <span className="font-bold text-slate-900">{row.routeName}</span> },
    { header: "Start", accessor: "startPoint", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.startPoint || "—"}</span> },
    { header: "End", accessor: "endPoint", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.endPoint || "—"}</span> },
    { header: "Vehicle", accessor: "vehicle", render: (row) => <span className="text-slate-600 font-medium text-xs">{row.vehicle?.vehicleNumber || "Unassigned"}</span> },
    { header: "Base Fare (₹)", accessor: "fare", render: (row) => <span className="font-medium text-emerald-600">₹{row.fare}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: handleEdit },
    { icon: Trash2, label: "Delete", onClick: handleDelete },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
            <Map size={18} className="text-indigo-600" /> {editingId ? "Edit Route" : "Create Route"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Route Name *</label>
              <input type="text" value={form.routeName} onChange={setField("routeName")} placeholder="e.g. City Center via Main St" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Start Point</label>
              <input type="text" value={form.startPoint} onChange={setField("startPoint")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">End Point</label>
              <input type="text" value={form.endPoint} onChange={setField("endPoint")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Base Fare (₹)</label>
              <input type="number" min="0" value={form.fare} onChange={setField("fare")} placeholder="e.g. 1500" className={inputClass} />
            </div>
            <FormMessage error={formError} />
            <button type="submit" disabled={saving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Route" : "Save Route"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="w-full py-3 text-sm font-bold text-slate-500">Cancel edit</button>
            )}
          </form>
        </div>
      </div>

      <div className="xl:col-span-2">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Active Routes</h3>
          </div>
          <LoadState loading={loading} error={error} />
          {!loading && !error && <DataTable columns={columns} data={routes} actions={actions} />}
        </div>
      </div>
    </div>
  );
};

export default RoutesManagement;
