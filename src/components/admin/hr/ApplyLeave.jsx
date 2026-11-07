import React, { useState } from "react";
import { Plus } from "lucide-react";
import useApiData from "../../../hooks/useApiData";
import { employeesApi, leavesApi } from "../../../services/api";
import { employeeFromApi } from "../../../utils/mappers";
import { leaveTypes } from "../../../mock/hrData"; // leave types are not supported by the backend

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium";
const labelClass = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";
const today = () => new Date().toISOString().slice(0, 10);

const ApplyLeave = ({ onApplied }) => {
  const { data: employees, loading, error } = useApiData(
    async () => (await employeesApi.list()).map(employeeFromApi),
    [],
    []
  );
  const [form, setForm] = useState({ leaveType: leaveTypes[0]?.name ?? "", employeeId: "", startDate: "", endDate: "", reason: "" });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError("");
    setSuccess("");
    if (form.endDate < form.startDate) {
      setActionError("End date cannot be before start date");
      return;
    }
    setSaving(true);
    try {
      await leavesApi.create({
        leaveType: form.leaveType,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        reason: form.reason.trim() || undefined,
        employeeId: Number(form.employeeId),
      });
      setForm((prev) => ({ ...prev, employeeId: "", startDate: "", endDate: "", reason: "" }));
      setSuccess("Leave application submitted.");
      if (onApplied) onApplied();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 max-w-3xl">
      <h3 className="font-black text-slate-900 tracking-tight mb-6">Leave Application</h3>
      {loading && <p className="text-sm font-medium text-slate-500 mb-4">Loading staff...</p>}
      {error && <p className="text-sm font-bold text-rose-600 mb-4">{error}</p>}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Leave Type *</label>
              <select required value={form.leaveType} onChange={setField("leaveType")} className={`${inputClass} appearance-none`}>
                  {leaveTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Staff *</label>
              <select required value={form.employeeId} onChange={setField("employeeId")} className={`${inputClass} appearance-none`}>
                  <option value="">Select Staff...</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.staffId})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Apply Date</label>
              <input type="date" value={today()} readOnly className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                  <label className={labelClass}>From *</label>
                  <input type="date" required value={form.startDate} onChange={setField("startDate")} className={inputClass} />
              </div>
              <div className="space-y-2">
                  <label className={labelClass}>To *</label>
                  <input type="date" required value={form.endDate} onChange={setField("endDate")} className={inputClass} />
              </div>
            </div>
        </div>
        <div className="space-y-2">
            <label className={labelClass}>Reason</label>
            <textarea rows="4" value={form.reason} onChange={setField("reason")} className={`${inputClass} resize-none`}></textarea>
        </div>
        {actionError && <p className="text-sm font-bold text-rose-600">{actionError}</p>}
        {success && <p className="text-sm font-bold text-emerald-600">{success}</p>}
        <button type="submit" disabled={saving} className="py-4 px-8 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm shadow-lg shadow-amber-100 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
            <Plus size={18} /> {saving ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;
