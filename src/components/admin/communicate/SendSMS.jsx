import React, { useState } from "react";
import { Send, MessageSquare, Trash2, Info } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { FormMessage, LoadState } from "../transport/TransportState";

const MAX_LENGTH = 500;
const field = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium";
const emptyForm = { audience: "", message: "", recipientCount: "" };

const SendSMS = () => {
  const { data, loading, error, reload } = useAsync(() => apiService.communicate.sms.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const smsLogs = data || [];
  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice("");
    if (!form.audience || !form.message.trim()) {
      setFormError("Recipient type and message are required.");
      return;
    }
    if (form.audience === "Custom" && !(Number(form.recipientCount) > 0)) {
      setFormError("Enter the number of recipients for a custom audience.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = { audience: form.audience, message: form.message.trim() };
    if (form.audience === "Custom") payload.recipientCount = Number(form.recipientCount);
    try {
      await apiService.communicate.sms.create(payload);
      setForm(emptyForm);
      setNotice("Message queued. No SMS gateway is connected, so it has not been delivered.");
      await reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this SMS record?")) return;
    try {
      await apiService.communicate.sms.remove(row.id);
      await reload();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const columns = [
    { header: "Date / Time", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}</span> },
    { header: "Message", accessor: "message", render: (row) => <span className="font-bold text-slate-900">{row.message}</span> },
    { header: "Recipient Type", accessor: "audience", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.audience}</span> },
    { header: "Count", accessor: "count", render: (row) => <span className="font-bold text-slate-700">{row.recipientCount ?? "—"}</span> },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === "Delivered" || row.status === "Sent" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
        }`}>
          {row.status}
        </span>
      )
    },
  ];

  const actions = [{ icon: Trash2, label: "Delete", variant: "danger", onClick: handleDelete }];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-3">
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
          <Info size={16} />
          Messages are queued only; no SMS gateway is connected, so nothing is actually delivered.
        </div>
      </div>
      {/* Send SMS Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <MessageSquare size={18} className="text-emerald-600" /> Compose SMS
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Send To *</label>
                <select value={form.audience} onChange={setField("audience")} className={`${field} appearance-none`}>
                   <option value="">Select Recipient Type</option>
                   <option value="Students">All Students</option>
                   <option value="Teachers">All Teachers</option>
                   <option value="Staff">All Staff</option>
                   <option value="Custom">Custom</option>
                </select>
             </div>
             {form.audience === "Custom" && (
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Recipient Count *</label>
                  <input type="number" min="1" value={form.recipientCount} onChange={setField("recipientCount")} className={field} />
               </div>
             )}
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Message *</label>
                <textarea rows="5" maxLength={MAX_LENGTH} value={form.message} onChange={setField("message")} placeholder="Enter your SMS content here..." className={`${field} resize-none focus:ring-2 focus:ring-emerald-500/20`}></textarea>
                <div className="flex justify-between px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Characters: {form.message.length} / {MAX_LENGTH}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">SMS Count: {Math.max(1, Math.ceil(form.message.length / 160))}</span>
                </div>
             </div>
             <FormMessage error={formError} />
             {notice && <p className="text-xs font-medium text-emerald-600">{notice}</p>}
             <button type="submit" disabled={saving} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
                <Send size={18} /> {saving ? "Queuing..." : "Queue SMS"}
             </button>
          </form>
        </div>
      </div>

      {/* SMS Logs List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">SMS Dispatch Log</h3>
            </div>
            <LoadState loading={loading} error={error} />
            {!loading && !error && <DataTable columns={columns} data={smsLogs} actions={actions} />}
         </div>
      </div>
    </div>
  );
};

export default SendSMS;
