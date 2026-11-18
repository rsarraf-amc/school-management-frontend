import React, { useState } from "react";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState, inputClass } from "./TransportState";

const emptyForm = { routeId: "", name: "", stopOrder: "", pickupTime: "", fare: "" };
const labelCls = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";

const StoppageManagement = () => {
  const { data: routes } = useAsync(() => apiService.transport.routes.list(), []);
  const { data, loading, error, reload } = useAsync(() => apiService.transport.stoppages.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const stoppages = data || [];
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.routeId || !form.name.trim()) {
      setFormError("Route and stoppage name are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      routeId: Number(form.routeId),
      name: form.name.trim(),
      stopOrder: form.stopOrder === "" ? 0 : Number(form.stopOrder),
      pickupTime: form.pickupTime || null,
      fare: form.fare === "" ? 0 : Number(form.fare),
    };
    try {
      if (editingId) await apiService.transport.stoppages.update(editingId, payload);
      else await apiService.transport.stoppages.create(payload);
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
      name: row.name || "",
      stopOrder: row.stopOrder ?? "",
      pickupTime: row.pickupTime ? String(row.pickupTime).slice(0, 5) : "",
      fare: row.fare ?? "",
    });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete stoppage ${row.name}?`)) return;
    try {
      await apiService.transport.stoppages.remove(row.id);
      if (editingId === row.id) resetForm();
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Route", accessor: "route", render: (r) => r.route?.routeName || "—" },
    { header: "Stoppage Name", accessor: "name" },
    { header: "Order", accessor: "stopOrder" },
    { header: "Pickup Time", accessor: "pickupTime", render: (r) => (r.pickupTime ? String(r.pickupTime).slice(0, 5) : "—") },
    { header: "Fare Amount (₹)", accessor: "fare" },
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
            <MapPin size={18} className="text-slate-600" /> {editingId ? "Edit Stoppage" : "Create Stoppage"}
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
              <label className={labelCls}>Stoppage Name *</label>
              <input type="text" value={form.name} onChange={setField("name")} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label className={labelCls}>Stop Order</label>
                <input type="number" min="0" value={form.stopOrder} onChange={setField("stopOrder")} className={inputClass} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Pickup Time</label>
                <input type="time" value={form.pickupTime} onChange={setField("pickupTime")} className={inputClass} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>Fare Amount (₹)</label>
              <input type="number" min="0" value={form.fare} onChange={setField("fare")} className={inputClass} />
            </div>
            <FormMessage error={formError} />
            <button type="submit" disabled={saving} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Stoppage" : "Save Stoppage"}
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
            <h3 className="font-black text-slate-900 tracking-tight">Active Stoppages</h3>
          </div>
          <LoadState loading={loading} error={error} />
          {!loading && !error && <DataTable columns={columns} data={stoppages} actions={actions} />}
        </div>
      </div>
    </div>
  );
};

export default StoppageManagement;
