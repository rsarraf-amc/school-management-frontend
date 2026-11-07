import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Upload } from "lucide-react";
import { incomeHeads } from "../../../mock/incomeData";

const AddIncome = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    incomeHead: "",
    name: "",
    invoiceNo: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    description: "",
    document: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Income:", formData);
    alert("Income saved successfully! (Mock)");
    navigate("/admin/income/search");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-900 tracking-tight">Record New Income</h3>
          <button 
            onClick={() => navigate("/admin/income")}
            className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Head */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Income Head *
              </label>
              <select
                name="incomeHead"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium appearance-none"
                value={formData.incomeHead}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {incomeHeads.map(head => (
                  <option key={head.id} value={head.name}>{head.name}</option>
                ))}
              </select>
            </div>

            {/* Name / Title */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Income Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Donation for Library"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Invoice No */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNo"
                placeholder="INC-0000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
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
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
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
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Attach Document
              </label>
              <div className="relative group">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => setFormData(prev => ({ ...prev, document: e.target.files[0] }))}
                />
                <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-2xl group-hover:bg-slate-100 transition-all text-sm font-medium flex items-center gap-3 text-slate-500">
                  <Upload size={18} />
                  {formData.document ? formData.document.name : "Choose file or drag here"}
                </div>
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
              placeholder="Additional details about this income..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-medium resize-none"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/admin/income")}
              className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2"
            >
              <Save size={18} />
              Save Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
