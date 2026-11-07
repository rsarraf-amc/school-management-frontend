import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  UserPlus,
  Users,
  Activity,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import StatCard from "../../ui/StatCard";
import useApiData from "../../../hooks/useApiData";
import { studentsApi } from "../../../services/api";
import { studentFromApi } from "../../../utils/mappers";

export default function StudentListing() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [applied, setApplied] = useState({ searchTerm: "", selectedClass: "", selectedSection: "" });
  const [actionError, setActionError] = useState("");

  const { data: students, loading, error, reload } = useApiData(
    async () => (await studentsApi.list()).map(studentFromApi),
    [],
    [],
  );

  const classes = useMemo(
    () => [...new Set(students.map((s) => s.class).filter(Boolean))].sort(),
    [students],
  );
  const sections = useMemo(
    () => [...new Set(students.map((s) => s.section).filter(Boolean))].sort(),
    [students],
  );

  const stats = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return {
      total: students.length,
      active: students.filter((s) => s.status === "Active").length,
      newAdmissions: students.filter((s) => s.admissionDate?.startsWith(monthKey)).length,
    };
  }, [students]);

  const filteredData = useMemo(() => {
    const { searchTerm, selectedClass, selectedSection } = applied;
    let data = students;
    if (searchTerm) {
      data = data.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (selectedClass) {
      data = data.filter((s) => s.class === selectedClass);
    }
    if (selectedSection) {
      data = data.filter((s) => s.section === selectedSection);
    }
    return data;
  }, [students, applied]);

  const handleFilter = () => setApplied({ searchTerm, selectedClass, selectedSection });

  const handleReset = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedSection("");
    setApplied({ searchTerm: "", selectedClass: "", selectedSection: "" });
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete ${row.name}?`)) return;
    setActionError("");
    try {
      await studentsApi.remove(row.id);
      reload();
    } catch (err) {
      setActionError(err.message || "Failed to delete student");
    }
  };

  const columns = [
    {
      header: "Admission No",
      accessor: "admissionNo",
      render: (row) => (
        <span
          className="font-bold text-indigo-600 hover:underline cursor-pointer"
          onClick={() => navigate(`../view/${row.id}`)}
        >
          {row.admissionNo}
        </span>
      ),
    },
    {
      header: "Student Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
            <img
              src={row.photo}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.name}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
              Roll: {row.rollNo}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Class (Section)",
      accessor: "class",
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold ring-1 ring-indigo-100">
            Class {row.class}
          </span>
          <span className="text-slate-400 font-bold">/</span>
          <span className="px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
            {row.section}
          </span>
        </div>
      ),
    },
    {
      header: "Father Name",
      accessor: "fatherName",
    },
    {
      header: "Gender",
      accessor: "gender",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            row.gender === "Male"
              ? "bg-blue-50 text-blue-600"
              : "bg-pink-50 text-pink-600"
          }`}
        >
          {row.gender}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  const actions = [
    {
      icon: Eye,
      label: "View Details",
      onClick: (row) => navigate(`../view/${row.id}`),
    },
    {
      icon: Edit,
      label: "Edit Student",
      onClick: (row) => navigate(`../edit/${row.id}`),
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: handleDelete,
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Students"
          value={stats.total.toLocaleString()}
          icon={<Users size={20} />}
          color="indigo"
          trend="Total"
        />
        <StatCard
          title="Active Now"
          value={stats.active.toLocaleString()}
          icon={<Activity size={20} />}
          color="emerald"
          trend={stats.total ? `${Math.round((stats.active / stats.total) * 100)}%` : "0%"}
        />
        <StatCard
          title="New Admissions"
          value={`+${stats.newAdmissions}`}
          icon={<UserPlus size={20} />}
          color="amber"
          trend="This Month"
        />
      </div>

      {/* Filters */}
      <FilterBar
        title="Student Search"
        description="Filter students by class, section or search by name/ID."
        onFilter={handleFilter}
        onReset={handleReset}
      >
        <FilterItem label="Search Student">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search name, admission no..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </FilterItem>
        <FilterItem label="Class">
          <select
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium appearance-none"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </FilterItem>
        <FilterItem label="Section">
          <select
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium appearance-none"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="">All Sections</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                Section {s}
              </option>
            ))}
          </select>
        </FilterItem>
      </FilterBar>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            Student List
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] uppercase">
              {filteredData.length} records
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
              <Search size={18} />
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
        {actionError && (
          <div className="m-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-bold">
            {actionError}
          </div>
        )}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold text-sm">Loading students...</div>
        ) : error ? (
          <div className="p-12 text-center space-y-4">
            <p className="text-rose-600 font-bold text-sm">{error}</p>
            <button
              onClick={reload}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95"
            >
              Retry
            </button>
          </div>
        ) : (
          <DataTable columns={columns} data={filteredData} actions={actions} />
        )}
      </div>
    </div>
  );
}
