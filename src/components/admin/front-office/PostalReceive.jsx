import { useState } from "react";
import DataTable from "../../ui/DataTable";
import StatCard from "../../ui/StatCard";
import SlideOver from "../../ui/SlideOver";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SectionCard from "../../ui/SectionCard";
import { postalReceiveStats, postalReceiveData } from "../../../mock/frontOfficeData";
import {
  Inbox,
  FileText,
  CheckCircle,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Edit2,
  Trash2,
} from "lucide-react";

export default function PostalReceive() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  const [data, setData] = useState(postalReceiveData);

  const handleFilter = () => {
    let filtered = postalReceiveData.filter((item) => {
      const matchesSearch =
        item.fromTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.refNo.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.toTitle.toLowerCase().includes(filters.search.toLowerCase());
      return matchesSearch;
    });
    setData(filtered);
  };

  const handleReset = () => {
    setFilters({ search: "", dateFrom: "", dateTo: "" });
    setData(postalReceiveData);
  };

  const columns = [
    { header: "Receive ID", accessor: "id" },
    { header: "From Title", accessor: "fromTitle" },
    { header: "Reference No", accessor: "refNo" },
    { header: "Address", accessor: "address" },
    { header: "To Title", accessor: "toTitle" },
    { header: "Date", accessor: "date" },
  ];

  const actions = [
    {
      label: "Edit Receive",
      icon: Edit2,
      onClick: (row) => console.log("Editing", row.id),
    },
    {
      label: "Delete Log",
      icon: Trash2,
      variant: "danger",
      onClick: (row) => console.log("Deleting", row.id),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Received"
          value={postalReceiveStats.totalReceived}
          icon={<Inbox size={20} />}
          color="indigo"
        />
        <StatCard
          title="Awaiting Sort"
          value={postalReceiveStats.awaitingSort}
          icon={<FileText size={20} />}
          color="amber"
        />
        <StatCard
          title="Distributed"
          value={postalReceiveStats.distributed}
          icon={<CheckCircle size={20} />}
          color="emerald"
        />
      </div>

      <FilterBar
        title="Search Receive Log"
        description="Filter postal receipts by title or reference."
        onFilter={handleFilter}
        onReset={handleReset}
      >
        <FilterItem label="Search">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Title, Ref or Address..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </FilterItem>

        <FilterItem label="Date Range">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </FilterItem>
      </FilterBar>

      <SectionCard
        title="Postal Receive Log"
        count={data.length}
        onAdd={() => setIsFormOpen(true)}
        addLabel="New Receive"
      >
        <DataTable columns={columns} data={data} actions={actions} />
      </SectionCard>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Postal Receive"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsFormOpen(false);
          }}
        >
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              From Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Reference No
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Address
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Note
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              To Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Attach Document
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              Save Data
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
