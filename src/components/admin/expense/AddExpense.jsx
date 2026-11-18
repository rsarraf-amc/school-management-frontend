import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Receipt } from "lucide-react";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const AddExpense = () => {
  const navigate = useNavigate();
  const { data: expenseHeads, loading, error: loadError } = useAsync(
    () => apiService.accounts.expenseHeads.list(),
    []
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [formData, setFormData] = useState({
    expenseHead: "",
    name: "",
    invoiceNo: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    try {
      await apiService.accounts.expenses.create({
        headId: Number(formData.expenseHead),
        name: formData.name.trim(),
        amount: Number(formData.amount),
        date: formData.date,
        invoiceNumber: formData.invoiceNo.trim() || undefined,
        description: formData.description.trim() || undefined,
      });
      navigate("/admin/expense");
    } catch (requestError) {
      setSaveError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
               <Receipt size={20} />
            </div>
            <h3 className="font-black text-slate-900 tracking-tight">Record New Expenditure</h3>
          </div>
          <button 
            onClick={() => navigate("/admin/expense")}
            className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {(loadError || saveError) && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">
              {saveError || loadError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense Head */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Expense Head *
              </label>
              <select
                name="expenseHead"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium appearance-none"
                value={formData.expenseHead}
                onChange={handleChange}
              >
                <option value="">{loading ? "Loading..." : "Select Category"}</option>
                {expenseHeads.map(head => (
                  <option key={head.id} value={head.id}>{head.name}</option>
                ))}
              </select>
            </div>

            {/* Name / Title */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Expense Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Monthly Electricity Bill"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Invoice No */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Voucher / Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNo"
                placeholder="EXP-0000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium"
                value={formData.invoiceNo}
                onChange={handleChange}
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            {/* Attachments are not supported by the backend */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Attach Bill / Receipt
              </label>
              <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-sm font-medium text-slate-400">
                Document upload is not available yet.
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              placeholder="Provide details about this expenditure..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium resize-none"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/admin/expense")}
              className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 disabled:opacity-50 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-100 flex items-center gap-2"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
