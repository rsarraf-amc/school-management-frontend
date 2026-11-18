import React, { useState } from "react";
import { Plus, Users, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState, inputClass } from "./TransportState";

const emptyForm = { name: "", phone: "", licenseNumber: "", licenseExpiry: "" };
const labelCls = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";

const AddDriver = () => {
  const { data, loading, error, reload } = useAsync(() => apiService.transport.drivers.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const drivers = data || [];
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Driver name is required.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      licenseNumber: form.licenseNumber.trim() || null,
      licenseExpiry: form.licenseExpiry || null,
    };
    try {
      if (editingId) await apiService.transport.drivers.update(editingId, payload);
      else await apiService.transport.drivers.create(payload);
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
      name: row.name || "",
      phone: row.phone || "",
      licenseNumber: row.licenseNumber || "",
      licenseExpiry: row.licenseExpiry ? String(row.licenseExpiry).slice(0, 10) : "",
    });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete driver ${row.name}?`)) return;
    try {
      await apiService.transport.drivers.remove(row.id);
      if (editingId === row.id) resetForm();
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Driver Name", accessor: "name" },
    { header: "License No", accessor: "licenseNumber", render: (r) => r.licenseNumber || "—" },
    { header: "License Expiry", accessor: "licenseExpiry", render: (r) => (r.licenseExpiry ? new Date(r.licenseExpiry).toLocaleDateString() : "—") },
    { header: "Phone", accessor: "phone", render: (r) => r.phone || "—" },
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
            <Users size={18} className="text-rose-600" /> {editingId ? "Edit Driver" : "Add Driver"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className={labelCls}>Driver Name *</label>
              <input type="text" value={form.name} onChange={setField("name")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>License No</label>
              <input type="text" value={form.licenseNumber} onChange={setField("licenseNumber")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>License Expiry</label>
              <input type="date" value={form.licenseExpiry} onChange={setField("licenseExpiry")} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>Phone</label>
              <input type="text" value={form.phone} onChange={setField("phone")} className={inputClass} />
            </div>
            <FormMessage error={formError} />
            <button type="submit" disabled={saving} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
              <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Driver" : "Save Driver"}
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
            <h3 className="font-black text-slate-900 tracking-tight">Driver Registry</h3>
          </div>
          <LoadState loading={loading} error={error} />
          {!loading && !error && <DataTable columns={columns} data={drivers} actions={actions} />}
        </div>
      </div>
    </div>
  );
};

export default AddDriver;
