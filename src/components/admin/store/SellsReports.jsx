import React, { useState } from "react";
import { BarChart2, Download } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, inputClass } from "../exam/ModuleState";

const SellsReports = () => {
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data, loading, error, reload } = useAsync(() => apiService.store.transactions.list({ type: "OUT" }), []);

  const sales = (data || []).filter(
    (t) =>
      t.type === "OUT" &&
      (!category || t.item?.category === category) &&
      (!from || t.date >= from) &&
      (!to || t.date <= to),
  );
  const categories = [...new Set((data || []).map((t) => t.item?.category).filter(Boolean))];
  const revenueOf = (t) => t.quantity * (t.item?.unitPrice || 0);
  const totalRevenue = sales.reduce((s, t) => s + revenueOf(t), 0);
  const totalQty = sales.reduce((s, t) => s + t.quantity, 0);

  const columns = [
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Product", accessor: "item", render: (row) => <span className="font-bold text-slate-900">{row.item?.name || `#${row.itemId}`}</span> },
    { header: "Qty", accessor: "quantity", render: (row) => <span className="font-bold text-slate-700">{row.quantity}</span> },
    { header: "Revenue", accessor: "revenue", render: (row) => <span className="font-bold text-emerald-600">₹{revenueOf(row).toLocaleString()}</span> },
  ];

  const exportCsv = () => {
    const lines = ["Date,Product,Qty,Revenue"].concat(
      sales.map((t) => [t.date, `"${(t.item?.name || "").replace(/"/g, '""')}"`, t.quantity, revenueOf(t)].join(",")),
    );
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <FilterBar title="Sales Analysis Report" description="Review store revenue and sales trends." onFilter={() => {}} onReset={() => { setCategory(""); setFrom(""); setTo(""); }}>
        <FilterItem label="Category">
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="From Date">
          <input type="date" className={inputClass} value={from} onChange={(e) => setFrom(e.target.value)} />
        </FilterItem>
        <FilterItem label="To Date">
          <input type="date" className={inputClass} value={to} onChange={(e) => setTo(e.target.value)} />
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart2 size={18} className="text-slate-600" /> Sales Revenue Log
          </h3>
          <button type="button" onClick={exportCsv} disabled={!sales.length} className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2 disabled:opacity-50">
            <Download size={18} /> Export CSV
          </button>
        </div>
        <LoadState loading={loading} error={error} onRetry={reload} />
        {!loading && !error && (sales.length ? <DataTable columns={columns} data={sales} /> : <EmptyState>No sales found.</EmptyState>)}
        <div className="p-6 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Sales Revenue</span>
            <p className="text-2xl font-black text-emerald-700">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Items Sold</span>
            <p className="text-2xl font-black text-emerald-700">{totalQty}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellsReports;
