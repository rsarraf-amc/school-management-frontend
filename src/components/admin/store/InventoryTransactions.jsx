import React, { useState } from "react";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage, inputClass, labelClass } from "../exam/ModuleState";

const todayStr = () => new Date().toISOString().slice(0, 10);
const emptyForm = () => ({ itemId: "", type: "OUT", quantity: 1, date: todayStr(), note: "" });
const TYPE_LABEL = { IN: "Purchase", OUT: "Sale" };

const InventoryTransactions = () => {
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [form, setForm] = useState(emptyForm());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const { data, loading, error, reload } = useAsync(async () => {
    const [transactions, items] = await Promise.all([apiService.store.transactions.list(), apiService.store.items.list()]);
    return { transactions, items };
  });
  const items = data?.items || [];
  const rows = (data?.transactions || []).filter(
    (t) => (!typeFilter || t.type === typeFilter) && (!dateFilter || t.date === dateFilter),
  );
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiService.store.transactions.create({
        itemId: Number(form.itemId),
        type: form.type,
        quantity: Number(form.quantity),
        date: form.date,
        note: form.note.trim() || undefined,
      });
      setForm(emptyForm());
      setShowForm(false);
      setMessage({ tone: "success", text: "Transaction recorded." });
      await reload();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm("Delete this transaction? Stock will be reversed.")) return;
    setMessage(null);
    try {
      await apiService.store.transactions.remove(row.id);
      await reload();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    }
  };

  const columns = [
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Type", accessor: "type", render: (row) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${row.type === "OUT" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
        {TYPE_LABEL[row.type] || row.type}
      </span>
    ) },
    { header: "Product", accessor: "item", render: (row) => <span className="font-bold text-slate-900">{row.item?.name || `#${row.itemId}`}</span> },
    { header: "Qty", accessor: "quantity", render: (row) => <span className="font-bold text-slate-700">{row.quantity}</span> },
    { header: "Value", accessor: "value", render: (row) => <span className="font-bold text-slate-900">₹{(row.quantity * (row.item?.unitPrice || 0)).toLocaleString()}</span> },
    { header: "Note", accessor: "note", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.note || "-"}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Buy / Sell Product" description="Track inventory purchases and sales." onFilter={() => {}} onReset={() => { setTypeFilter(""); setDateFilter(""); }}>
        <FilterItem label="Transaction Type">
          <select className={inputClass} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="OUT">Sale</option>
            <option value="IN">Purchase</option>
          </select>
        </FilterItem>
        <FilterItem label="Date">
          <input type="date" className={inputClass} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </FilterItem>
      </FilterBar>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className={labelClass}>Product *</label>
            <select required className={inputClass} value={form.itemId} onChange={set("itemId")}>
              <option value="">Select product</option>
              {items.map((i) => <option key={i.id} value={i.id}>{i.name} (stock {i.quantity})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Type *</label>
            <select className={inputClass} value={form.type} onChange={set("type")}>
              <option value="OUT">Sale (stock out)</option>
              <option value="IN">Purchase (stock in)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Quantity *</label>
            <input required type="number" min="1" className={inputClass} value={form.quantity} onChange={set("quantity")} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Date</label>
            <input type="date" className={inputClass} value={form.date} onChange={set("date")} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Note</label>
            <input className={inputClass} value={form.note} onChange={set("note")} />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={saving} className="w-full py-3 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 text-sm disabled:opacity-60">
              {saving ? "Saving..." : "Record Transaction"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/10">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart size={18} className="text-rose-600" /> Transaction Logs
          </h3>
          <button type="button" onClick={() => setShowForm((v) => !v)} className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2">
            <Plus size={18} /> {showForm ? "Cancel" : "New Transaction"}
          </button>
        </div>
        <LoadState loading={loading} error={error} onRetry={reload} />
        {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} actions={[{ icon: Trash2, label: "Delete", onClick: remove }]} /> : <EmptyState>No transactions found.</EmptyState>)}
      </div>
    </div>
  );
};

export default InventoryTransactions;
