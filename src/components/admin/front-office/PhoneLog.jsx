import { useState } from "react";
import DataTable from "../../ui/DataTable";
import StatCard from "../../ui/StatCard";
import SlideOver from "../../ui/SlideOver";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SectionCard from "../../ui/SectionCard";
import { phoneLogStats, phoneCallLogData } from "../../../mock/frontOfficeData";
import {
  PhoneIncoming,
  PhoneOutgoing,
  Phone,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Edit2,
  Trash2,
} from "lucide-react";

export default function PhoneLog() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    type: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [data, setData] = useState(phoneCallLogData);

  const handleFilter = () => {
    let filtered = phoneCallLogData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.phone.includes(filters.search);
      const matchesType = filters.type === "All" || item.type === filters.type;
      return matchesSearch && matchesType;
    });
    setData(filtered);
  };

  const handleReset = () => {
    setFilters({ search: "", type: "All", dateFrom: "", dateTo: "" });
    setData(phoneCallLogData);
  };

  const columns = [
    { header: "Name / Caller", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Date", accessor: "date" },
    { header: "Type", accessor: "type" },
    { header: "Duration", accessor: "duration" },
    { header: "Description", accessor: "description" },
  ];

  const actions = [
    {
      label: "Edit Log",
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
          title="Total Calls Today"
          value={phoneLogStats.totalCallsToday}
          icon={<Phone size={20} />}
          color="indigo"
        />
        <StatCard
          title="Incoming Calls"
          value={phoneLogStats.incomingCalls}
          icon={<PhoneIncoming size={20} />}
          color="emerald"
        />
        <StatCard
          title="Outgoing Calls"
          value={phoneLogStats.outgoingCalls}
          icon={<PhoneOutgoing size={20} />}
          color="rose"
        />
      </div>

      <FilterBar
        title="Search Call History"
        description="Filter logs by caller name, phone or type."
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
              placeholder="Name or Phone..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </FilterItem>

        <FilterItem label="Call Type">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            <option>All</option>
            <option>Incoming</option>
            <option>Outgoing</option>
          </select>
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
        title="Phone Call Log"
        count={data.length}
        onAdd={() => setIsFormOpen(true)}
        addLabel="Log Call"
      >
        <DataTable columns={columns} data={data} actions={actions} />
      </SectionCard>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Phone Call Log"
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
              Name
            </label>
            <input
              type="text"
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
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Next Follow Up
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Call Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 05:20"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Call Type
            </label>
            <div className="flex gap-4 mt-2 border border-slate-200 rounded-lg p-1 bg-slate-50">
              <label className="flex-1 text-center cursor-pointer relative">
                <input
                  type="radio"
                  name="callType"
                  value="incoming"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="py-2 text-sm font-bold text-slate-500 peer-checked:text-indigo-600 peer-checked:bg-white rounded-md shadow-sm transition-all duration-200">
                  Incoming
                </div>
              </label>
              <label className="flex-1 text-center cursor-pointer relative">
                <input
                  type="radio"
                  name="callType"
                  value="outgoing"
                  className="peer sr-only"
                />
                <div className="py-2 text-sm font-bold text-slate-500 peer-checked:text-rose-600 peer-checked:bg-white rounded-md shadow-sm transition-all duration-200">
                  Outgoing
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Description
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
              Save Log
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
