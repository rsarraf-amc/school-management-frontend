import { useState } from "react";
import DataTable from "../../ui/DataTable";
import StatCard from "../../ui/StatCard";
import SlideOver from "../../ui/SlideOver";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SectionCard from "../../ui/SectionCard";
import { complainsStats, complainData } from "../../../mock/frontOfficeData";
import {
  MessageSquareWarning,
  AlertCircle,
  CheckCircle2,
  FileClock,
  Plus,
  Filter,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  CheckCircle,
} from "lucide-react";

export default function Complains() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    against: "All",
    status: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [data, setData] = useState(complainData);

  const handleFilter = () => {
    let filtered = complainData.filter((item) => {
      const matchesSearch =
        item.by.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.id.toLowerCase().includes(filters.search.toLowerCase());
      const matchesAgainst =
        filters.against === "All" || item.against === filters.against;
      const matchesStatus =
        filters.status === "All" || item.status === filters.status;
      return matchesSearch && matchesAgainst && matchesStatus;
    });
    setData(filtered);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      against: "All",
      status: "All",
      dateFrom: "",
      dateTo: "",
    });
    setData(complainData);
  };

  const columns = [
    { header: "Complain ID", accessor: "id" },
    { header: "Complain By", accessor: "by" },
    { header: "Against", accessor: "against" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
    { header: "Description", accessor: "description" },
  ];

  const actions = [
    {
      label: "Mark Resolved",
      icon: CheckCircle,
      onClick: (row) => console.log("Resolving", row.id),
    },
    {
      label: "Edit Complain",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complains"
          value={complainsStats.totalComplains}
          icon={<MessageSquareWarning size={20} />}
          color="slate"
        />
        <StatCard
          title="Pending"
          value={complainsStats.pending}
          icon={<AlertCircle size={20} />}
          color="rose"
        />
        <StatCard
          title="In Progress"
          value={complainsStats.inProgress}
          icon={<FileClock size={20} />}
          color="amber"
        />
        <StatCard
          title="Resolved"
          value={complainsStats.resolved}
          icon={<CheckCircle2 size={20} />}
          color="emerald"
        />
      </div>

      <FilterBar
        title="Search Complain Register"
        description="Filter complaints by name, category or status."
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
              placeholder="Name or ID..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </FilterItem>

        <FilterItem label="Against">
          <select
            value={filters.against}
            onChange={(e) =>
              setFilters({ ...filters, against: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            <option>All</option>
            <option>Transport</option>
            <option>Academics</option>
            <option>Infrastructure</option>
            <option>Staff Behavior</option>
          </select>
        </FilterItem>

        <FilterItem label="Status">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </FilterItem>

        <FilterItem label="Date Range">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
              className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </FilterItem>
      </FilterBar>

      <SectionCard
        title="Complain Register"
        count={data.length}
        onAdd={() => setIsFormOpen(true)}
        addLabel="Lodge Complain"
      >
        <DataTable columns={columns} data={data} actions={actions} />
      </SectionCard>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Complain"
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsFormOpen(false);
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Complain Type *
              </label>
              <select
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option>Academics</option>
                <option>Transport</option>
                <option>Infrastructure</option>
                <option>Staff Behavior</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Source *
              </label>
              <select
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option>Online</option>
                <option>Walk-in</option>
                <option>Phone</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Complain By *
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
                Phone
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
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Action Taken
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Assigned
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
              Save Complain
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
