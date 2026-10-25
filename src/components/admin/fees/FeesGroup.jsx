import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  LayoutGrid,
  List,
} from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SlideOver from "../../ui/SlideOver";

export default function FeesGroup() {
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [filters, setFilters] = useState({
    search: "",
  });
  const [filteredData, setFilteredData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const groups = [
    {
      id: 1,
      name: "Admission Fees",
      description: "Standard admission charges for new students.",
      count: 5,
    },
    {
      id: 2,
      name: "Monthly Fees",
      description: "Regular monthly tuition and maintenance.",
      count: 12,
    },
    {
      id: 3,
      name: "Exam Fees",
      description: "Fees for quarterly and annual examinations.",
      count: 3,
    },
    {
      id: 4,
      name: "Transport Fees",
      description: "Route-based transportation charges.",
      count: 8,
    },
    {
      id: 5,
      name: "Library Fees",
      description: "Annual library membership and usage.",
      count: 2,
    },
  ];

  const handleFilter = () => {
    let result = groups;

    if (filters.search) {
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          g.description.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    setFilteredData(result);
  };

  const handleReset = () => {
    setFilters({
      search: "",
    });
    setFilteredData(null);
  };

  const displayGroups = filteredData !== null ? filteredData : groups;

  return (
    <div className="space-y-6 relative">
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          {/* Filter Bar */}
          <div className="mb-8">
            <FilterBar
              title="Search Fee Groups"
              description="Find groups by name or description"
              onFilter={handleFilter}
              onReset={handleReset}
              icon={Search}
            >
              <FilterItem label="Group Name / Description">
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </FilterItem>

              <FilterItem label="View Mode" className="lg:col-span-2">
                <div className="flex bg-slate-50 p-1 rounded-xl w-fit">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "table"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <List size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                </div>
              </FilterItem>
            </FilterBar>
          </div>

          {/* Table/Grid View */}

          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-700 tracking-wider">
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Description</th>
                    <th className="px-4 py-4">Fee Types</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {displayGroups.map((group) => (
                    <tr
                      key={group.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 font-black text-slate-700">
                        {group.name}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-500 max-w-xs truncate">
                        {group.description}
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                          {group.count} Types
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white hover:text-blue-500 rounded-xl transition-all text-slate-400 shadow-sm border border-transparent hover:border-blue-100">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 hover:bg-white hover:text-rose-500 rounded-xl transition-all text-slate-400 shadow-sm border border-transparent hover:border-rose-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-6 rounded-3xl border border-slate-100 hover:border-emerald-200 bg-slate-50/30 hover:bg-white transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-black text-slate-800">
                      {group.name}
                    </h3>
                    <button className="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed line-clamp-2">
                    {group.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                      {group.count} Active Types
                    </span>
                    <button className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsFormOpen(true)}
        className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-600/20 w-14 h-14 hover:bg-emerald-700 transition-colors"
        aria-label="Add Fee Group"
      >
        <Plus size={24} />
      </button>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Fee Group"
      >
        <form className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Group Name
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly Fees"
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Description
            </label>
            <textarea
              placeholder="Short description..."
              rows={4}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
            ></textarea>
          </div>

          <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
            Save Fee Group
          </button>
        </form>
      </SlideOver>
    </div>
  );
}
