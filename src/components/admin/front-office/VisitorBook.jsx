import { useState } from "react";
import DataTable from "../../ui/DataTable";
import StatCard from "../../ui/StatCard";
import SlideOver from "../../ui/SlideOver";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SectionCard from "../../ui/SectionCard";
import {
  visitorBookData,
  frontOfficeStats,
} from "../../../mock/frontOfficeData";
import {
  Users,
  DoorOpen,
  DoorClosed,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Edit2,
  Trash2,
} from "lucide-react";

export default function VisitorBook() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    purpose: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [data, setData] = useState(visitorBookData);

  const handleFilter = () => {
    let filtered = visitorBookData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.phone.includes(filters.search);
      const matchesPurpose =
        filters.purpose === "All" || item.purpose === filters.purpose;
      return matchesSearch && matchesPurpose;
    });
    setData(filtered);
  };

  const handleReset = () => {
    setFilters({ search: "", purpose: "All", dateFrom: "", dateTo: "" });
    setData(visitorBookData);
  };

  const columns = [
    { header: "Visitor ID", accessor: "id", width: 140 },
    { header: "Name", accessor: "name", width: 180 },
    { header: "Purpose", accessor: "purpose", width: 240 },
    { header: "Phone", accessor: "phone", width: 150 },
    { header: "Date", accessor: "date", width: 120 },
    { header: "In Time", accessor: "inTime", width: 110 },
    { header: "Out Time", accessor: "outTime", width: 110 },
  ];

  const actions = [
    {
      label: "Edit Entry",
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
          title="Total Visitors Today"
          value={frontOfficeStats.totalEnquiries.toString()}
          icon={<Users size={20} />}
          color="indigo"
        />
        <StatCard
          title="Currently In Campus"
          value={frontOfficeStats.activeEnquiries.toString()}
          icon={<DoorOpen size={20} />}
          color="amber"
        />
        <StatCard
          title="Checked Out"
          value={frontOfficeStats.closedEnquiries.toString()}
          icon={<DoorClosed size={20} />}
          color="emerald"
        />
      </div>

      <FilterBar
        title="Search Visitor Log"
        description="Filter visitors by name, ID, or purpose."
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
              placeholder="ID, Name or Phone..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </FilterItem>

        <FilterItem label="Purpose">
          <select
            value={filters.purpose}
            onChange={(e) =>
              setFilters({ ...filters, purpose: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            <option>All</option>
            <option>Admissions Info</option>
            <option>Parent Meeting</option>
            <option>Vendor/Supplier</option>
            <option>Interview</option>
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
        title="Visitor Log"
        count={data.length}
        onAdd={() => setIsFormOpen(true)}
        addLabel="Add Visitor"
      >
        <DataTable columns={columns} data={data} actions={actions} />
      </SectionCard>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Check-in Visitor"
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
              Purpose *
            </label>
            <select
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>Admissions Info</option>
              <option>Parent Meeting</option>
              <option>Vendor/Supplier</option>
              <option>Interview</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Name *
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
                ID Card No.
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                No. of Person
              </label>
              <input
                type="number"
                defaultValue={1}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Date *
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                In Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Out Time
              </label>
              <input
                type="time"
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
              Save Visitor
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
