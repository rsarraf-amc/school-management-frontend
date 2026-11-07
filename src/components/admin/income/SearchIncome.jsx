import React, { useState } from "react";
import { Search, Edit, Trash2, FileText, Calendar } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { incomeList } from "../../../mock/incomeData";

const SearchIncome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filteredData, setFilteredData] = useState(incomeList);

  const handleFilter = () => {
    let data = incomeList;
    if (searchTerm) {
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (dateFrom) {
      data = data.filter((item) => item.date >= dateFrom);
    }
    if (dateTo) {
      data = data.filter((item) => item.date <= dateTo);
    }
    setFilteredData(data);
  };

  const handleReset = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setFilteredData(incomeList);
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{row.name}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            ID: {row.invoiceNo}
          </span>
        </div>
      ),
    },
    {
      header: "Income Head",
      accessor: "incomeHead",
      render: (row) => (
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
          {row.incomeHead}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: "date",
      render: (row) => (
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Calendar size={14} className="text-slate-400" />
          {row.date}
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span className="font-black text-emerald-600">
          ₹{row.amount.toLocaleString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      icon: FileText,
      label: "View Document",
      onClick: (row) => alert(`Viewing document: ${row.document || "No document attached"}`),
    },
    {
      icon: Edit,
      label: "Edit Entry",
      onClick: (row) => alert(`Editing: ${row.name}`),
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: (row) => alert(`Deleting: ${row.name}`),
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
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
          </h3>
        </div>
        <DataTable columns={columns} data={filteredData} actions={actions} />
      </div>
    </div>
  );
};

export default SearchIncome;
