import React, { useState } from "react";
import { ShoppingBag, Plus, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage, inputClass, labelClass } from "../exam/ModuleState";

const emptyForm = { name: "", category: "", unit: "", quantity: 0, unitPrice: 0 };

const ProductManagement = () => {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const { data, loading, error, reload } = useAsync(() => apiService.store.items.list(), []);

  const items = data || [];
  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const rows = items.filter(
    (i) => (!category || i.category === category) && (i.name || "").toLowerCase().includes(search.toLowerCase()),
  );
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiService.store.items.create({
        name: form.name.trim(),
        category: form.category.trim() || undefined,
        unit: form.unit.trim() || undefined,
        quantity: Number(form.quantity),
        unitPrice: Number(form.unitPrice),
      });
      setForm(emptyForm);
      setShowForm(false);
      setMessage({ tone: "success", text: "Product saved." });
      await reload();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete "${row.name}" and its transactions?`)) return;
    setMessage(null);
    try {
      await apiService.store.items.remove(row.id);
      await reload();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    }
  };

  const columns = [
    { header: "Product Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Category", accessor: "category", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.category || "-"}</span> },
    { header: "Unit", accessor: "unit", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.unit || "-"}</span> },
    { header: "Stock", accessor: "quantity", render: (row) => <span className={`font-black ${row.quantity < 20 ? "text-rose-600" : "text-slate-700"}`}>{row.quantity}</span> },
    { header: "Price", accessor: "unitPrice", render: (row) => <span className="font-bold text-emerald-600">₹{row.unitPrice}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Product Catalog" description="Search and filter store items." onFilter={() => {}} onReset={() => { setCategory(""); setSearch(""); }}>
        <FilterItem label="Search">
          <input type="text" className={inputClass} placeholder="Product name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </FilterItem>
        <FilterItem label="Category">
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FilterItem>
      </FilterBar>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className={labelClass}>Name *</label>
            <input required className={inputClass} value={form.name} onChange={set("name")} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Category</label>
            <input list="store-categories" className={inputClass} value={form.category} onChange={set("category")} />
            <datalist id="store-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Unit</label>
            <input className={inputClass} placeholder="pcs, box..." value={form.unit} onChange={set("unit")} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Opening Stock</label>
            <input type="number" min="0" className={inputClass} value={form.quantity} onChange={set("quantity")} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Unit Price</label>
            <input type="number" min="0" step="0.01" className={inputClass} value={form.unitPrice} onChange={set("unitPrice")} />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={saving} className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 text-sm disabled:opacity-60">
              {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/10">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag size={18} className="text-emerald-600" /> Product List
          </h3>
          <button type="button" onClick={() => setShowForm((v) => !v)} className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2">
            <Plus size={18} /> {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>
        <LoadState loading={loading} error={error} onRetry={reload} />
        {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} actions={[{ icon: Trash2, label: "Delete", onClick: remove }]} /> : <EmptyState>No products found.</EmptyState>)}
      </div>
    </div>
  );
};

export default ProductManagement;
