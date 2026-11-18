import React, { useState } from "react";
import { Plus, Edit, Trash2, Layers, Save } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const emptyForm = { name: "", description: "" };

const ExpenseHead = () => {
  const { data: heads, loading, error, reload } = useAsync(
    () => apiService.accounts.expenseHeads.list(),
    []
  );
  const [newHead, setNewHead] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const resetForm = () => {
    setNewHead(emptyForm);
    setEditingId(null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    const payload = { name: newHead.name.trim(), description: newHead.description.trim() };
    try {
      if (editingId) {
        await apiService.accounts.expenseHeads.update(editingId, payload);
      } else {
        await apiService.accounts.expenseHeads.create(payload);
      }
      resetForm();
      await reload();
    } catch (requestError) {
      setSaveError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setNewHead({ name: row.name || "", description: row.description || "" });
    setSaveError("");
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete expense head "${row.name}"?`)) return;
    setSaveError("");
    try {
      await apiService.accounts.expenseHeads.remove(row.id);
      if (editingId === row.id) resetForm();
      await reload();
    } catch (requestError) {
      setSaveError(requestError.message);
    }
  };

  const columns = [
    {
      header: "Expense Head",
      accessor: "name",
      render: (row) => (
        <span className="font-bold text-slate-900">{row.name}</span>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      render: (row) => (
        <span className="text-slate-500 italic text-sm">
          {row.description || "No description provided"}
        </span>
      ),
    },
  ];

  const actions = [
    { label: "Edit", icon: Edit, onClick: handleEdit },
    { label: "Delete", icon: Trash2, variant: "danger", onClick: handleDelete },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {(error || saveError) && (
        <div className="lg:col-span-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">
          {saveError || error}
        </div>
      )}
      {/* List Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              Expense Heads
              <span className="px-2 py-0.5 bg-rose-100 text-rose-600 rounded-md text-[10px] uppercase">
                {heads.length} categories
              </span>
            </h3>
          </div>
          {loading ? (
            <div className="px-6 py-8 text-center text-sm text-slate-500">Loading...</div>
          ) : (
            <DataTable columns={columns} data={heads} actions={actions} />
          )}
        </div>
      </div>

      {/* Add Form Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div className="p-6 border-b border-slate-100 bg-rose-50/30">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers size={18} className="text-rose-600" />
              {editingId ? "Edit Expense Head" : "Add Expense Head"}
            </h3>
          </div>
          <form onSubmit={handleAdd} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Electricity Bill"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium"
                value={newHead.name}
                onChange={(e) => setNewHead({ ...newHead, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                Description
              </label>
              <textarea
                rows="4"
                placeholder="Brief details about this category..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-medium resize-none"
                value={newHead.description}
                onChange={(e) => setNewHead({ ...newHead, description: e.target.value })}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full disabled:opacity-50 py-4  bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-100 flex items-center justify-center gap-2 mt-4"
            >
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {saving ? "Saving..." : editingId ? "Update Category" : "Add Category"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseHead;
