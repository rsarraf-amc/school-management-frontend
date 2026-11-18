import { useState } from "react";
import DataTable from "../../ui/DataTable";
import StatCard from "../../ui/StatCard";
import SlideOver from "../../ui/SlideOver";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SectionCard from "../../ui/SectionCard";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { fieldClass, filterClass, labelClass, LoadState } from "./FrontOfficeState";
import { Users, CheckCircle, Clock, XCircle, Search, Edit2, Trash2 } from "lucide-react";

const STATUSES = ["Active", "Won", "Lost"];
const SOURCES = ["Website", "Walk-in", "Reference", "Advertisement"];
const emptyForm = { name: "", phone: "", email: "", source: "", date: "", status: "Active", note: "" };
const emptyFilters = { search: "", source: "All", status: "All", dateFrom: "", dateTo: "" };

export default function AdmissionEnquiry() {
  const { data, loading, error, reload } = useAsync(() => apiService.frontOffice.enquiries.list(), []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);

  const enquiries = data || [];
  const sources = [...new Set([...SOURCES, ...enquiries.map((e) => e.source).filter(Boolean)])];

  const rows = enquiries.filter((e) => {
    const q = applied.search.toLowerCase();
    return (
      (!q ||
        String(e.id).includes(q) ||
        (e.name || "").toLowerCase().includes(q) ||
        (e.phone || "").includes(q)) &&
      (applied.source === "All" || e.source === applied.source) &&
      (applied.status === "All" || e.status === applied.status) &&
      (!applied.dateFrom || e.date >= applied.dateFrom) &&
      (!applied.dateTo || e.date <= applied.dateTo)
    );
  });

  const count = (status) => enquiries.filter((e) => e.status === status).length;

  const openForm = (row) => {
    setFormError("");
    setEditingId(row ? row.id : null);
    setForm(
      row
        ? {
            name: row.name || "",
            phone: row.phone || "",
            email: row.email || "",
            source: row.source || "",
            date: row.date || "",
            status: row.status || "Active",
            note: row.note || "",
          }
        : emptyForm,
    );
    setIsFormOpen(true);
  };

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    const payload = {
      Name: form.name.trim(),
      Phone: form.phone.trim() || null,
      Email: form.email.trim() || null,
      Source: form.source || null,
      Note: form.note.trim() || null,
      Status: form.status,
    };
    if (form.date) payload.Date = form.date;
    try {
      if (editingId) await apiService.frontOffice.enquiries.update(editingId, payload);
      else await apiService.frontOffice.enquiries.create(payload);
      setIsFormOpen(false);
      await reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (fn) => {
    setActionError("");
    try {
      await fn();
      await reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { header: "Enquiry ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Phone", accessor: "phone", render: (r) => r.phone || "—" },
    { header: "Email", accessor: "email", render: (r) => r.email || "—" },
    { header: "Source", accessor: "source", render: (r) => r.source || "—" },
    { header: "Date", accessor: "date" },
    { header: "Status", accessor: "status" },
    { header: "Note", accessor: "note", render: (r) => r.note || "—" },
  ];

  const actions = [
    { label: "Edit Enquiry", icon: Edit2, onClick: (row) => openForm(row) },
    {
      label: "Delete Details",
      icon: Trash2,
      variant: "danger",
      onClick: (row) => {
        if (window.confirm(`Delete enquiry from ${row.name}?`)) {
          runAction(() => apiService.frontOffice.enquiries.remove(row.id));
        }
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Enquiries" value={enquiries.length} icon={<Users size={20} />} color="indigo" />
        <StatCard title="Active Leads" value={count("Active")} icon={<Clock size={20} />} color="amber" />
        <StatCard title="Admissions Done" value={count("Won")} icon={<CheckCircle size={20} />} color="emerald" />
        <StatCard title="Lost" value={count("Lost")} icon={<XCircle size={20} />} color="rose" />
      </div>

      <FilterBar
        title="Advanced Search Filters"
        description="Filter enquiries quickly with clean inputs."
        onFilter={() => setApplied(filters)}
        onReset={() => {
          setFilters(emptyFilters);
          setApplied(emptyFilters);
        }}
      >
        <FilterItem label="Search">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="ID, Name or Phone"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className={`${filterClass} pl-10`}
            />
          </div>
        </FilterItem>
        <FilterItem label="Source">
          <select value={filters.source} onChange={(e) => setFilters({ ...filters, source: e.target.value })} className={filterClass}>
            <option>All</option>
            {sources.map((s) => <option key={s}>{s}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Status">
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={filterClass}>
            <option>All</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Date Range">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className={filterClass} />
            <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className={filterClass} />
          </div>
        </FilterItem>
      </FilterBar>

      <SectionCard title="Admission Enquiry Register" count={rows.length} onAdd={() => openForm(null)} addLabel="New Enquiry">
        {actionError && <p className="px-6 py-3 text-xs font-medium text-rose-600">{actionError}</p>}
        <LoadState loading={loading} error={error} />
        {!loading && !error && <DataTable columns={columns} data={rows} actions={actions} />}
      </SectionCard>

      <SlideOver isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Admission Enquiry" : "Add Admission Enquiry"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className={labelClass}>Name *</label>
            <input type="text" required value={form.name} onChange={setField("name")} className={fieldClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Phone</label>
              <input type="text" value={form.phone} onChange={setField("phone")} className={fieldClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Email</label>
              <input type="email" value={form.email} onChange={setField("email")} className={fieldClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Date</label>
              <input type="date" value={form.date} onChange={setField("date")} className={fieldClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={setField("status")} className={fieldClass}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Source</label>
            <select value={form.source} onChange={setField("source")} className={fieldClass}>
              <option value="">Select source</option>
              {sources.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Note</label>
            <textarea rows={2} value={form.note} onChange={setField("note")} className={fieldClass} />
          </div>
          {formError && <p className="text-xs font-medium text-rose-600">{formError}</p>}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-60">
              {saving ? "Saving..." : "Save Enquiry"}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
