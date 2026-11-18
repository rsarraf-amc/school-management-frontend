import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ShieldCheck, TrendingUp, Users, UserPlus, Key, BookOpen, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import StatCard from "../../ui/StatCard";
import NotConnectedNotice from "../../ui/NotConnectedNotice";
import IssuedCredentials from "../../ui/IssuedCredentials";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import {
  studentHistoryColumns,
} from "../../../utils/columnsConfig";

const fullName = (s) => [s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");
const dateOnly = (d) => (d ? String(d).slice(0, 10) : "—");

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

const LoadState = ({ loading, error }) => {
  if (loading) return <p className="text-sm font-medium text-slate-500">Loading…</p>;
  if (error)
    return (
      <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
        {error}
      </p>
    );
  return null;
};

const SearchInput = ({ icon: Icon = Search, placeholder, value, onChange }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const matches = (term, ...values) => {
  const q = term.trim().toLowerCase();
  return !q || values.some((v) => String(v ?? "").toLowerCase().includes(q));
};

export const StudentHistory = () => (
  <ModuleShell title="Student History" description="Comprehensive log of all student-related activities and system updates.">
    <NotConnectedNotice />
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-black text-slate-900 tracking-tight">Activity Logs</h3>
      </div>
      <DataTable columns={studentHistoryColumns} data={[]} />
    </div>
  </ModuleShell>
);

export const StudentLoginCredentials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [applied, setApplied] = useState("");
  const [issued, setIssued] = useState(null);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(() => apiService.getAllStudents(), []);

  const issue = async (row) => {
    setActionError("");
    try {
      const credentials = await apiService.issueStudentLogin(row.id);
      setIssued({ name: row.name, credentials });
      reload?.();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const rows = useMemo(
    () =>
      (data || [])
        .map((s) => ({
          id: s.id,
          admissionNo: s.admissionNumber,
          name: fullName(s),
          username: s.loginUsername,
        }))
        .filter((r) => matches(applied, r.name, r.admissionNo, r.username)),
    [data, applied],
  );

  const columns = [
    { header: "Admission No", accessor: "admissionNo" },
    { header: "Student Name", accessor: "name" },
    {
      header: "Username",
      accessor: "username",
      render: (row) =>
        row.username ? (
          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">{row.username}</span>
        ) : (
          <span className="text-slate-400 text-xs">No login created</span>
        ),
    },
    {
      header: "Action",
      render: (row) => (
        <button
          type="button"
          onClick={() => issue(row)}
          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100"
        >
          {row.username ? "Reset password" : "Create login"}
        </button>
      ),
    },
  ];

  return (
    <ModuleShell title="Login Credentials" description="Student portal usernames. Passwords are shown once when a login is created or reset.">
      <FilterBar title="Account Search" onFilter={() => setApplied(searchTerm)} onReset={() => { setSearchTerm(""); setApplied(""); }}>
        <FilterItem label="Search User">
          <SearchInput icon={Key} placeholder="Name, ID or Username..." value={searchTerm} onChange={setSearchTerm} />
        </FilterItem>
      </FilterBar>

      {actionError && (
        <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">{actionError}</p>
      )}
      {issued && (
        <IssuedCredentials
          title={`Login ready for ${issued.name}`}
          credentials={issued.credentials}
          onDone={() => setIssued(null)}
        />
      )}

      <LoadState loading={loading} error={error} />
      {!loading && !error && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              Credential Management
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] uppercase">{rows.length} accounts</span>
            </h3>
          </div>
          <DataTable columns={columns} data={rows} />
        </div>
      )}
    </ModuleShell>
  );
};

export const AdmissionReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [applied, setApplied] = useState("");
  const { data, loading, error } = useAsync(() => apiService.getAllStudents(), []);
  const students = data || [];

  const stats = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    const classes = new Set(students.map((s) => s.class).filter(Boolean));
    return [
      { title: "Total Admissions", value: students.length, icon: <UserPlus />, color: "indigo" },
      {
        title: "This Month",
        value: students.filter((s) => String(s.admissionDate || "").slice(0, 7) === month).length,
        icon: <TrendingUp />,
        color: "amber",
      },
      { title: "Classes", value: classes.size, icon: <Users />, color: "emerald" },
      {
        title: "With Login",
        value: students.filter((s) => s.loginUsername).length,
        icon: <ShieldCheck />,
        color: "violet",
      },
    ];
  }, [students]);

  const rows = students
    .map((s) => ({
      id: s.id,
      admissionNo: s.admissionNumber,
      name: fullName(s),
      class: s.class,
      section: s.section,
      fatherName: s.guardianName,
      date: dateOnly(s.admissionDate),
    }))
    .filter((r) => matches(applied, r.name, r.admissionNo));

  const columns = [
    { header: "Admission No", accessor: "admissionNo" },
    { header: "Student Name", accessor: "name" },
    { header: "Class (Section)", accessor: "class", render: (row) => `${row.class || "—"}${row.section ? ` (${row.section})` : ""}` },
    { header: "Guardian", accessor: "fatherName", render: (row) => row.fatherName || "—" },
    { header: "Admission Date", accessor: "date" },
  ];

  return (
    <ModuleShell title="Admission Report" description="Overview of campus admissions based on enrolled students.">
      <LoadState loading={loading} error={error} />
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <FilterBar title="Report Filters" onFilter={() => setApplied(searchTerm)} onReset={() => { setSearchTerm(""); setApplied(""); }}>
            <FilterItem label="Student Search">
              <SearchInput placeholder="Filter by name/ID..." value={searchTerm} onChange={setSearchTerm} />
            </FilterItem>
          </FilterBar>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900 tracking-tight">Admission Detailed Records</h3>
            </div>
            <DataTable columns={columns} data={rows} />
          </div>
        </>
      )}
    </ModuleShell>
  );
};

const categoryTableColumns = [
  { header: "Category Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
  { header: "Description", accessor: "description", render: (row) => row.description || "-" },
];

const categoryEmpty = { name: "", description: "" };
const inputCls = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20";
const labelCls = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";

export const StudentCategory = () => {
  const [form, setForm] = useState(categoryEmpty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(() => apiService.academics.studentCategories.list(), []);
  const rows = data || [];

  const reset = () => {
    setForm(categoryEmpty);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() || undefined };
      if (editingId) await apiService.academics.studentCategories.update(editingId, payload);
      else await apiService.academics.studentCategories.create(payload);
      reset();
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete category "${row.name}"?`)) return;
    setActionError("");
    try {
      await apiService.academics.studentCategories.remove(row.id);
      if (editingId === row.id) reset();
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const actions = [
    { icon: Edit, label: "Edit", onClick: (row) => { setEditingId(row.id); setForm({ name: row.name || "", description: row.description || "" }); } },
    { icon: Trash2, label: "Delete", variant: "danger", onClick: remove },
  ];

  return (
    <ModuleShell title="Student Category" description="Configure institutional student groupings and categories.">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-black text-slate-900 tracking-tight mb-6">{editingId ? "Edit Category" : "Add Category"}</h3>
            <form className="space-y-4" onSubmit={submit}>
              {actionError && (
                <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">{actionError}</p>
              )}
              <div className="space-y-2">
                <label className={labelCls}>Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Description</label>
                <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} />
              </div>
              <button type="submit" disabled={saving} className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update Category" : "Save Category"}
              </button>
              {editingId && (
                <button type="button" onClick={reset} className="w-full text-xs font-bold text-slate-500 underline">Cancel edit</button>
              )}
            </form>
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-black text-slate-900 tracking-tight">Category Groups</h3>
            </div>
            <div className="p-4"><LoadState loading={loading} error={error} /></div>
            {!loading && !error && <DataTable columns={categoryTableColumns} data={rows} actions={actions} />}
          </div>
        </div>
      </div>
    </ModuleShell>
  );
};

export const AssignStudentSubject = () => {
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const subjects = useAsync(() => apiService.timetable.subjects.list(), []);
  const students = useAsync(() => apiService.getAllStudents(), []);
  const assignments = useAsync(() => apiService.academics.studentSubjects.list(), []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      await apiService.academics.studentSubjects.create({ studentId, subjectId });
      setSubjectId("");
      await assignments.reload();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm("Remove this subject assignment?")) return;
    setActionError("");
    try {
      await apiService.academics.studentSubjects.remove(row.id);
      await assignments.reload();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const assignmentColumns = [
    { header: "Admission No", accessor: "admissionNo", render: (row) => row.student?.admissionNumber || "-" },
    { header: "Student Name", accessor: "name", render: (row) => (row.student ? fullName(row.student) : "-") },
    { header: "Subject", accessor: "subject", render: (row) => <span className="font-bold text-slate-900">{row.subject?.name || "-"}</span> },
  ];

  return (
    <ModuleShell title="Assign Student Subject" description="Map academic subjects to students based on curriculum and class level.">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end" onSubmit={submit}>
          <div className="space-y-2">
            <label className={labelCls}>Student *</label>
            <select required value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputCls}>
              <option value="">{students.loading ? "Loading..." : "Select Student"}</option>
              {(students.data || []).map((s) => (
                <option key={s.id} value={s.id}>{fullName(s)}{s.admissionNumber ? ` (${s.admissionNumber})` : ""}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className={labelCls}>Subject *</label>
            <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className={inputCls}>
              <option value="">{subjects.loading ? "Loading..." : "Select Subject"}</option>
              {(subjects.data || []).map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={saving} className="py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm disabled:opacity-50">
            {saving ? "Saving..." : "Assign Subject"}
          </button>
        </form>
        {actionError && (
          <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">{actionError}</p>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-600" />
            Subject Assignment Matrix
          </h3>
        </div>
        <div className="p-4"><LoadState loading={assignments.loading} error={assignments.error} /></div>
        {!assignments.loading && !assignments.error && (
          <DataTable columns={assignmentColumns} data={assignments.data || []} actions={[{ icon: Trash2, label: "Remove", variant: "danger", onClick: remove }]} />
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-black text-slate-900 mb-4">Available Subjects Reference</h3>
        <LoadState loading={subjects.loading} error={subjects.error} />
        {!subjects.loading && !subjects.error && (subjects.data || []).length === 0 && (
          <p className="text-sm font-medium text-slate-400">No subjects defined yet.</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {(subjects.data || []).map((sub) => (
            <div key={sub.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{sub.code || "—"}</p>
              <p className="font-bold text-slate-900 text-sm">{sub.name}</p>
            </div>
          ))}
        </div>
      </div>
    </ModuleShell>
  );
};
