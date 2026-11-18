import React, { useState } from "react";
import { Plus, Truck, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState, inputClass } from "./TransportState";

const emptyForm = { vehicleNumber: "", vehicleType: "", capacity: "", driverName: "", driverPhone: "" };

const VehiclesManagement = () => {
  const { data, loading, error, reload } = useAsync(() => apiService.transport.vehicles.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const vehicles = data || [];
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vehicleNumber.trim()) {
      setFormError("Vehicle number is required.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      VehicleNumber: form.vehicleNumber.trim(),
      VehicleType: form.vehicleType.trim() || null,
      Capacity: form.capacity === "" ? null : Number(form.capacity),
      DriverName: form.driverName.trim() || null,
      DriverPhone: form.driverPhone.trim() || null,
    };
    try {
      if (editingId) await apiService.transport.vehicles.update(editingId, payload);
      else await apiService.transport.vehicles.create(payload);
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
      vehicleNumber: row.vehicleNumber || "",
      vehicleType: row.vehicleType || "",
      capacity: row.capacity ?? "",
      driverName: row.driverName || "",
      driverPhone: row.driverPhone || "",
    });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete vehicle ${row.vehicleNumber}?`)) return;
    try {
      await apiService.transport.vehicles.remove(row.id);
      if (editingId === row.id) resetForm();
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Vehicle No", accessor: "vehicleNumber", render: (row) => <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.vehicleNumber}</span> },
    { header: "Type", accessor: "vehicleType", render: (row) => <span className="font-bold text-slate-900">{row.vehicleType || "—"}</span> },
    { header: "Capacity", accessor: "capacity", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.capacity ?? "—"}</span> },
    { header: "Driver", accessor: "driverName", render: (row) => <span className="font-bold text-slate-700">{row.driverName || "—"}</span> },
    { header: "Driver Contact", accessor: "driverPhone", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.driverPhone || "—"}</span> },
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
            <Truck size={18} className="text-emerald-600" /> {editingId ? "Edit Vehicle" : "Add Vehicle"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle No *</label>
              <input type="text" value={form.vehicleNumber} onChange={setField("vehicleNumber")} placeholder="e.g. UP-32-AB-1234" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle Type</label>
              <input type="text" value={form.vehicleType} onChange={setField("vehicleType")} placeholder="e.g. Bus" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Capacity</label>
              <input type="number" min="0" value={form.capacity} onChange={setField("capacity")} placeholder="e.g. 40" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Driver Name</label>
              <input type="text" value={form.driverName} onChange={setField("driverName")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Driver Phone</label>
              <input type="text" value={form.driverPhone} onChange={setField("driverPhone")} className={inputClass} />
            </div>
            <FormMessage error={formError} />
            <button type="submit" disabled={saving} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Vehicle" : "Save Vehicle"}
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
            <h3 className="font-black text-slate-900 tracking-tight">Vehicle Inventory</h3>
          </div>
          <LoadState loading={loading} error={error} />
          {!loading && !error && <DataTable columns={columns} data={vehicles} actions={actions} />}
        </div>
      </div>
    </div>
  );
};

export default VehiclesManagement;
