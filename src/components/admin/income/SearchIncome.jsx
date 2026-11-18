import React, { useMemo, useState } from "react";
import { Search, Trash2, Calendar } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const rupees = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const dayOf = (value) => String(value || "").slice(0, 10);

const SearchIncome = () => {
  const { data, loading, error, reload } = useAsync(async () => {
    const [items, heads] = await Promise.all([
      apiService.accounts.incomes.list(),
      apiService.accounts.incomeHeads.list(),
    ]);
    return { items, heads };
  }, { items: [], heads: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [headId, setHeadId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [applied, setApplied] = useState({ searchTerm: "", headId: "", dateFrom: "", dateTo: "" });
  const [actionError, setActionError] = useState("");

  const handleFilter = () => setApplied({ searchTerm, headId, dateFrom, dateTo });

  const handleReset = () => {
    setSearchTerm("");
    setHeadId("");
    setDateFrom("");
    setDateTo("");
    setApplied({ searchTerm: "", headId: "", dateFrom: "", dateTo: "" });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete income "${row.name}"?`)) return;
    setActionError("");
    try {
      await apiService.accounts.incomes.remove(row.id);
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const filteredData = useMemo(() => {
    const term = applied.searchTerm.trim().toLowerCase();
    return data.items.filter((item) => {
      if (applied.headId && String(item.headId ?? item.head?.id) !== applied.headId) return false;
      if (applied.dateFrom && dayOf(item.date) < applied.dateFrom) return false;
      if (applied.dateTo && dayOf(item.date) > applied.dateTo) return false;
      if (term) {
        return (
          (item.name || "").toLowerCase().includes(term) ||
          (item.invoiceNumber || "").toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [data, applied]);

  const totalAmount = filteredData.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.name}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            ID: {row.invoiceNumber || "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Income Head",
      accessor: "incomeHead",
      render: (row) => (
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
          {row.head?.name || "—"}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "date",
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Calendar size={14} className="text-slate-400" />
          {dayOf(row.date)}
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span className="font-black text-emerald-600">{rupees(row.amount)}</span>
      ),
    },
  ];

  const actions = [
    { label: "Delete", icon: Trash2, variant: "danger", onClick: handleDelete },
  ];

  return (
    <div className="space-y-6">
      {(error || actionError) && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">
          {actionError || error}
        </div>
      )}
      {/* Filters */}
      <FilterBar
        title="Search Income"
        description="Filter records by date range or search by keyword."
        onFilter={handleFilter}
        onReset={handleReset}
      >
        <FilterItem label="Search Keyword">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Name or Invoice No..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </FilterItem>
        <FilterItem label="Income Head">
          <select
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium appearance-none"
            value={headId}
            onChange={(e) => setHeadId(e.target.value)}
          >
            <option value="">All Heads</option>
            {data.heads.map((head) => (
              <option key={head.id} value={String(head.id)}>{head.name}</option>
            ))}
          </select>
        </FilterItem>
        <FilterItem label="Date From">
          <input
            type="date"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </FilterItem>
        <FilterItem label="Date To">
          <input
            type="date"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </FilterItem>
      </FilterBar>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            Income Records
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-md text-[10px] uppercase">
              {filteredData.length} records
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] uppercase">
              Total {rupees(totalAmount)}
            </span>
          </h3>
        </div>
        {loading ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">Loading...</div>
        ) : (
          <DataTable columns={columns} data={filteredData} actions={actions} />
        )}
      </div>
    </div>
  );
};

export default SearchIncome;
