import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  History,
  ShieldCheck,
  TrendingUp,
  Users,
  UserPlus,
  MoreHorizontal,
  Key,
  RefreshCw,
  Lock,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Filter
} from 'lucide-react';
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import StatCard from "../../ui/StatCard";
import {
  admissionReportsData,
  studentHistoryData,
  loginCredentialsData,
  studentCategoriesData,
  subjectsData,
  studentSubjectAssignmentsData
} from "../../../mock/studentSubModulesData";
import {
  admissionReportColumns,
  studentHistoryColumns,
  loginCredentialsColumns,
  categoryColumns,
  subjectAssignmentColumns
} from "../../../utils/columnsConfig";

const ModuleShell = ({ title, children, description = "Management and reporting module", showBack = true }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">{description}</p>
        </div>
        {showBack && (
          <button
            onClick={() => navigate("/admin/student")}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-all hover:bg-white hover:shadow-sm rounded-xl"
          >
            <ArrowLeft size={18} />
            Back to Hub
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

/* -------------------- 1. Student History -------------------- */
export const StudentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(studentHistoryData);

  const handleFilter = () => {
    const filtered = studentHistoryData.filter(h =>
      h.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setData(studentHistoryData);
  };

  return (
    <ModuleShell title="Student History" description="Comprehensive log of all student-related activities and system updates.">
      <FilterBar
        title="Search History"
        description="Filter logs by student name, ID or action type."
        onFilter={handleFilter}
        onReset={handleReset}
      >
        <FilterItem label="Student Search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Name or Admission No..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            Activity Logs
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] uppercase">
              {data.length} records
            </span>
          </h3>
        </div>
        <DataTable columns={studentHistoryColumns} data={data} />
      </div>
    </ModuleShell>
  );
};

/* -------------------- 2. Login Credentials -------------------- */
export const StudentLoginCredentials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(loginCredentialsData);

  const handleFilter = () => {
    const filtered = loginCredentialsData.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setData(loginCredentialsData);
  };

  const actions = [
    {
      icon: RefreshCw,
      label: "Reset Password",
      onClick: (row) => alert(`Resetting password for ${row.name}`),
    },
    {
      icon: Lock,
      label: "Toggle Access",
      onClick: (row) => alert(`Toggling access for ${row.name}`),
    },
    {
      icon: Edit,
      label: "Edit Username",
      onClick: (row) => alert(`Editing username for ${row.name}`),
    },
  ];

  return (
    <ModuleShell title="Login Credentials" description="Manage student portal access and system authentication.">
      <FilterBar
        title="Account Search"
        onFilter={handleFilter}
        onReset={handleReset}
      >
        <FilterItem label="Search User">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Name, ID or Username..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            Credential Management
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] uppercase">
              {data.length} accounts
            </span>
          </h3>
        </div>
        <DataTable columns={loginCredentialsColumns} data={data} actions={actions} />
      </div>
    </ModuleShell>
  );
};

/* -------------------- 3. Admission Report -------------------- */
export const AdmissionReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(admissionReportsData);

  const stats = useMemo(() => {
    return [
      { title: "Total Admissions", value: "48", icon: <UserPlus />, color: "indigo", trend: "+12%" },
      { title: "Pending Reviews", value: "05", icon: <TrendingUp />, color: "amber", trend: "High Priority" },
      { title: "Active Enrollment", value: "94.2%", icon: <Users />, color: "emerald", trend: "Stable" },
      { title: "Capacity Utilization", value: "82%", icon: <ShieldCheck />, color: "violet", trend: "Near Full" },
    ];
  }, []);

  const handleFilter = () => {
    const filtered = admissionReportsData.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setData(admissionReportsData);
  };

  return (
    <ModuleShell title="Admission Report" description="Analytical overview of campus admissions and enrollment trends.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <FilterBar
        title="Report Filters"
        onFilter={handleFilter}
        onReset={handleReset}
      >
        <FilterItem label="Student Search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Filter by name/ID..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            Admission Detailed Records
          </h3>
          <button className="text-xs font-bold text-indigo-600 hover:underline">Export Full Report</button>
        </div>
        <DataTable columns={admissionReportColumns} data={data} />
      </div>
    </ModuleShell>
  );
};

/* -------------------- 4. Student Category -------------------- */
export const StudentCategory = () => {
  return (
    <ModuleShell title="Student Category" description="Configure institutional student groupings and institutional categories.">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-slate-900 text-lg">Category Groups</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
          <Plus size={18} />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentCategoriesData.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs">
                {cat.code}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                  <Edit size={14} />
                </button>
                <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <h4 className="font-black text-slate-900 text-xl mb-1">{cat.name}</h4>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
              <Users size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-600">{cat.count} Students</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-slate-900 tracking-tight">Summary Table</h3>
        </div>
        <DataTable columns={categoryColumns} data={studentCategoriesData} />
      </div>
    </ModuleShell>
  );
};

/* -------------------- 5. Assign Student Subject -------------------- */
export const AssignStudentSubject = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(studentSubjectAssignmentsData);

  const handleFilter = () => {
    const filtered = studentSubjectAssignmentsData.filter(a =>
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setData(studentSubjectAssignmentsData);
  };

  return (
    <ModuleShell title="Assign Student Subject" description="Map academic subjects to students based on curriculum and class level.">
      <FilterBar
        title="Mapping Search"
        onFilter={handleFilter}
        onReset={handleReset}
      >
        <FilterItem label="Student Search">
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Find student..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            Subject Assignment Matrix
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all">
            <Plus size={14} />
            Bulk Assign
          </button>
        </div>
        <DataTable columns={subjectAssignmentColumns} data={data} actions={[
          { icon: Edit, label: "Modify Subjects", onClick: (row) => alert(`Modifying subjects for ${row.studentName}`) }
        ]} />
      </div>

      <div className="mt-8">
        <h3 className="font-black text-slate-900 mb-4">Available Subjects Reference</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjectsData.map(sub => (
            <div key={sub.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{sub.type}</p>
              <p className="font-bold text-slate-900 text-sm">{sub.name}</p>
            </div>
          ))}
        </div>
      </div>
    </ModuleShell>
  );
};

