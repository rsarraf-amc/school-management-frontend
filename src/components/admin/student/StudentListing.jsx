import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Search,
  UserPlus,
  Users,
  Activity,
  MoreHorizontal,
} from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import StatCard from "../../ui/StatCard";
import { apiService } from "../../../services/apiService";

export default function StudentListing() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([apiService.getAllStudents(), apiService.getAllClasses()])
      .then(([studentRecords, classRecords]) => {
        if (!active) return;
        setStudents(studentRecords);
        setClasses(classRecords);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const displayStudents = useMemo(
    () =>
      students.map((student) => ({
        ...student,
        name: [student.firstName, student.lastName].filter(Boolean).join(" "),
        admissionNo: student.admissionNumber,
        rollNo: student.rollNumber,
        class: student.class || student.classModel?.name || "",
        fatherName: student.guardianName || "",
        photo: student.profilePhotoUrl || "",
      })),
    [students],
  );

  const filteredData = displayStudents.filter((student) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !query ||
      student.name.toLowerCase().includes(query) ||
      String(student.admissionNo || "").toLowerCase().includes(query);
    const matchesClass =
      !selectedClass || String(student.class) === String(selectedClass);
    const matchesSection =
      !selectedSection || student.section === selectedSection;
    return matchesSearch && matchesClass && matchesSection;
  });
  const sections = [...new Set(students.map((student) => student.section).filter(Boolean))];

  const handleFilter = () => setSearchTerm(searchTerm.trim());

  const handleReset = () => {
    setSearchTerm("");
    setSelectedClass("");
    setSelectedSection("");
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      return;
    }
    try {
      await apiService.deleteStudent(student.id);
      setStudents((records) =>
        records.filter((record) => record.id !== student.id),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const currentMonthAdmissions = students.filter((student) => {
    const admissionDate = new Date(student.admissionDate || student.createdAt);
    const now = new Date();
    return (
      !Number.isNaN(admissionDate.getTime()) &&
      admissionDate.getMonth() === now.getMonth() &&
      admissionDate.getFullYear() === now.getFullYear()
    );
  }).length;

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
            {row.photo ? (
              <img
                src={row.photo}
                alt={row.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center font-bold text-slate-500">
                {row.name.charAt(0) || "S"}
              </span>
            )}
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
      header: "Guardian",
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
          value={students.length.toLocaleString()}
          icon={<Users size={20} />}
          color="indigo"
          trend="Total"
        />
        <StatCard
          title="Classes"
          value={classes.length.toLocaleString()}
          icon={<Activity size={20} />}
          color="emerald"
          trend="Current"
        />
        <StatCard
          title="New Admissions"
          value={`+${currentMonthAdmissions}`}
          icon={<UserPlus size={20} />}
          color="amber"
          trend="This Month"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
      {loading && (
        <p className="rounded-xl bg-white p-4 text-sm font-medium text-slate-500">
          Loading students...
        </p>
      )}

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
            {classes.map((classRecord) => (
              <option key={classRecord.id} value={classRecord.name}>
                {classRecord.name}
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
        <DataTable columns={columns} data={filteredData} actions={actions} />
      </div>
    </div>
  );
}
