import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import DataTable from "../../ui/DataTable";
import StatusMessage from "../../ui/StatusMessage";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

// Leave types are stored as free text on the backend (Leave.LeaveType).
export const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Medical Leave", "Maternity Leave", "Paternity Leave", "Unpaid Leave"];

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium";
const labelClass = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";

const fmt = (value) => (value ? new Date(value).toLocaleDateString() : "-");
const days = (from, to) => Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
const staffName = (row) => [row.employee?.firstName, row.employee?.lastName].filter(Boolean).join(" ") || `#${row.employeeId}`;

export const LeaveRequests = () => {
  const { data, loading, error, setError, reload } = useAsync(() => apiService.leaves.list(), []);

  const setStatus = async (row, status) => {
    try {
      await apiService.leaves.update(row.id, { status });
      await reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const columns = [
    { header: "Staff", accessor: "employeeId", render: (row) => <span className="font-bold text-slate-900">{staffName(row)}</span> },
    { header: "Leave Type", accessor: "leaveType", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.leaveType}</span> },
    { header: "Date", accessor: "startDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{fmt(row.startDate)} - {fmt(row.endDate)}</span> },
    { header: "Days", accessor: "days", render: (row) => <span className="font-bold text-slate-700">{days(row.startDate, row.endDate)}</span> },
    { header: "Apply Date", accessor: "createdAt", render: (row) => <span className="text-slate-500 font-medium text-xs">{fmt(row.createdAt)}</span> },
    { header: "Reason", accessor: "reason", render: (row) => <span className="text-slate-500 text-xs">{row.reason || "-"}</span> },
    { header: "Status", accessor: "status", render: (row) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
        row.status === "Approved" ? "bg-emerald-50 text-emerald-600" : row.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
      }`}>{row.status}</span>
    ) },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <StatusMessage loading={loading} error={error} empty={!loading && !error && data.length === 0} emptyText="No leave requests." />
      {!loading && data.length > 0 && (
        <DataTable columns={columns} data={data} actions={[
          { icon: Check, label: "Approve", onClick: (row) => setStatus(row, "Approved") },
          { icon: X, label: "Disapprove", variant: "danger", onClick: (row) => setStatus(row, "Rejected") },
        ]} />
      )}
    </div>
  );
};

export const ApplyLeaveForm = () => {
  const { data: employees, loading, error: loadError } = useAsync(() => apiService.getAllEmployees(), []);
  const blank = { employeeId: "", leaveType: LEAVE_TYPES[0], startDate: "", endDate: "", reason: "" };
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await apiService.leaves.create({ ...form, employeeId: Number(form.employeeId) });
      setForm(blank);
      setMessage({ type: "ok", text: "Leave application submitted." });
    } catch (requestError) {
      setMessage({ type: "err", text: requestError.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 max-w-3xl">
      <h3 className="font-black text-slate-900 tracking-tight mb-6">Leave Application</h3>
      <form className="space-y-6" onSubmit={submit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>Leave Type *</label>
            <select required value={form.leaveType} onChange={set("leaveType")} className={`${inputClass} appearance-none`}>
              {LEAVE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Staff *</label>
            <select required value={form.employeeId} onChange={set("employeeId")} className={`${inputClass} appearance-none`}>
              <option value="">{loading ? "Loading..." : "Select Staff..."}</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {[employee.firstName, employee.lastName].filter(Boolean).join(" ")} ({employee.employeeNumber})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>From *</label>
            <input required type="date" value={form.startDate} onChange={set("startDate")} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>To *</label>
            <input required type="date" min={form.startDate} value={form.endDate} onChange={set("endDate")} className={inputClass} />
          </div>
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Reason</label>
          <textarea rows="4" maxLength={255} value={form.reason} onChange={set("reason")} className={`${inputClass} resize-none`} />
        </div>
        {(loadError || message.text) && (
          <p className={`text-sm font-bold ${message.type === "ok" ? "text-emerald-600" : "text-rose-600"}`}>{loadError || message.text}</p>
        )}
        <button type="submit" disabled={saving} className="py-4 px-8 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm shadow-lg shadow-amber-100 flex items-center gap-2 disabled:opacity-60">
          <Plus size={18} /> {saving ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export const LeaveTypeList = () => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="p-6 border-b border-slate-100 bg-slate-50/30">
      <h3 className="font-black text-slate-900 tracking-tight">Leave Types</h3>
      <p className="text-xs text-slate-500 mt-1">Leave types are free text on the backend; these are the options offered when applying.</p>
    </div>
    <DataTable
      columns={[{ header: "Leave Type Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> }]}
      data={LEAVE_TYPES.map((name) => ({ id: name, name }))}
    />
  </div>
);
