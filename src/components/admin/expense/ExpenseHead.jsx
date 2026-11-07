import React, { useState } from "react";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { expenseHeads } from "../../../mock/expenseData";

const ExpenseHead = () => {
  const [heads, setHeads] = useState(expenseHeads);
  const [newHead, setNewHead] = useState({ name: "", description: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    const head = { ...newHead, id: heads.length + 1 };
    setHeads([...heads, head]);
    setNewHead({ name: "", description: "" });
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
    {
      icon: Edit,
      label: "Edit",
      onClick: (row) => alert(`Editing Head: ${row.name}`),
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: (row) => alert(`Deleting Head: ${row.name}`),
      variant: "danger",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
          <DataTable columns={columns} data={heads} actions={actions} />
        </div>
      </div>

      {/* Add Form Section */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div className="p-6 border-b border-slate-100 bg-rose-50/30">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers size={18} className="text-rose-600" />
              Add Expense Head
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
              className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-100 flex items-center justify-center gap-2 mt-4"
            >
              <Plus size={18} />
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseHead;
