import { useState } from "react";
import DataTable from "../../ui/DataTable";
import StatCard from "../../ui/StatCard";
import SlideOver from "../../ui/SlideOver";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SectionCard from "../../ui/SectionCard";
import { admissionEnquiryStats, admissionEnquiriesData } from "../../../mock/frontOfficeData";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Phone,
  Edit2,
  Trash2,
} from "lucide-react";

export default function AdmissionEnquiry() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    source: "All",
    status: "All",
    dateFrom: "",
    dateTo: "",
  });

  const [data, setData] = useState(admissionEnquiriesData);

  const handleFilter = () => {
    let filtered = admissionEnquiriesData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.phone.includes(filters.search);
      const matchesSource =
        filters.source === "All" || item.source === filters.source;
      const matchesStatus =
        filters.status === "All" || item.status === filters.status;

      // Basic date matching for demo
      const matchesDate = true;

      return matchesSearch && matchesSource && matchesStatus && matchesDate;
    });
    setData(filtered);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      source: "All",
      status: "All",
      dateFrom: "",
      dateTo: "",
    });
    setData(admissionEnquiriesData);
  };

  const columns = [
    { header: "Enquiry ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone" },
    { header: "Source", accessor: "source" },
    { header: "Date", accessor: "date" },
    { header: "Class", accessor: "class" },
    { header: "Status", accessor: "status" },
    { header: "Next Follow Up", accessor: "nextFollowUp" },
  ];

  const actions = [
    {
      label: "Call for Follow Up",
      icon: Phone,
      onClick: (row) => console.log("Calling", row.name),
    },
    {
      label: "Edit Enquiry",
      icon: Edit2,
      onClick: (row) => console.log("Editing", row.id),
    },
    {
      label: "Delete Details",
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
          title="Total Enquiries"
          value={admissionEnquiryStats.totalEnquiries}
          icon={<Users size={20} />}
          color="indigo"
          trend="+15%"
        />
        <StatCard
          title="Active Leads"
          value={admissionEnquiryStats.activeEnquiries}
          icon={<Clock size={20} />}
          color="amber"
          trend="30% of total"
        />
        <StatCard
          title="Admissions Done"
          value={admissionEnquiryStats.closedEnquiries}
          icon={<CheckCircle size={20} />}
          color="emerald"
          trend="68% Success"
        />
        <StatCard
          title="Follow Ups"
          value={admissionEnquiryStats.pendingFollowUp}
          icon={<FileText size={20} />}
          color="rose"
        />
      </div>

      <FilterBar
        title="Advanced Search Filters"
        description="Filter enquiries quickly with clean inputs."
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
              placeholder="ID, Name or Phone"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all"
            />
          </div>
        </FilterItem>

        <FilterItem label="Source">
          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            <option>All</option>
            <option>Website</option>
            <option>Walk-in</option>
            <option>Reference</option>
            <option>Advertisement</option>
          </select>
        </FilterItem>

        <FilterItem label="Status">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
          >
            <option>All</option>
            <option>Active</option>
            <option>Follow up</option>
            <option>Closed</option>
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
        title="Admission Enquiry Register"
        count={data.length}
        onAdd={() => setIsFormOpen(true)}
        addLabel="New Enquiry"
      >
        <DataTable columns={columns} data={data} actions={actions} />
      </SectionCard>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Admission Enquiry"
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
                Phone *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
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

          <div className="grid grid-cols-2 gap-4">
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
                Next Follow Up
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
              rows={2}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Source
              </label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Advertisement</option>
                <option>Walk-in</option>
                <option>Reference</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                Class
              </label>
              <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Class 1</option>
                <option>Class 2</option>
                <option>Class 3</option>
              </select>
            </div>
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
              Save Enquiry
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
