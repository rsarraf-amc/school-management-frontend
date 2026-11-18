import { useState } from "react";
import DataTable from "../../ui/DataTable";
import StatCard from "../../ui/StatCard";
import SlideOver from "../../ui/SlideOver";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SectionCard from "../../ui/SectionCard";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import {
  fieldClass,
  filterClass,
  formatDate,
  formatTime,
  labelClass,
  LoadState,
  localDateKey,
} from "./FrontOfficeState";
import { Users, DoorOpen, DoorClosed, Search, Edit2, Trash2, LogOut } from "lucide-react";

const emptyForm = { visitorName: "", purpose: "", phone: "", whomToMeet: "" };
const emptyFilters = { search: "", purpose: "All", dateFrom: "", dateTo: "" };

export default function VisitorBook() {
  const { data, loading, error, reload } = useAsync(() => apiService.frontOffice.visitors.list(), []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionError, setActionError] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);

  const visitors = data || [];
  const today = localDateKey(new Date());
  const todays = visitors.filter((v) => localDateKey(v.checkIn) === today);
  const purposes = [...new Set(visitors.map((v) => v.purpose).filter(Boolean))].sort();

  const rows = visitors.filter((v) => {
    const q = applied.search.toLowerCase();
    const day = localDateKey(v.checkIn);
    return (
      (!q ||
        String(v.id).includes(q) ||
        (v.visitorName || "").toLowerCase().includes(q) ||
        (v.phone || "").includes(q)) &&
      (applied.purpose === "All" || v.purpose === applied.purpose) &&
      (!applied.dateFrom || day >= applied.dateFrom) &&
      (!applied.dateTo || day <= applied.dateTo)
    );
  });

  const openForm = (row) => {
    setFormError("");
    setEditingId(row ? row.id : null);
    setForm(
      row
        ? {
            visitorName: row.visitorName || "",
            purpose: row.purpose || "",
            phone: row.phone || "",
            whomToMeet: row.whomToMeet || "",
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
      VisitorName: form.visitorName.trim(),
      Purpose: form.purpose.trim(),
      Phone: form.phone.trim() || null,
      WhomToMeet: form.whomToMeet.trim() || null,
    };
    try {
      if (editingId) await apiService.frontOffice.visitors.update(editingId, payload);
      else await apiService.frontOffice.visitors.create(payload);
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
    { header: "Visitor ID", accessor: "id", width: 100 },
    { header: "Name", accessor: "visitorName", width: 180 },
    { header: "Purpose", accessor: "purpose", width: 220 },
    { header: "Phone", accessor: "phone", render: (r) => r.phone || "—", width: 150 },
    { header: "Whom To Meet", accessor: "whomToMeet", render: (r) => r.whomToMeet || "—", width: 160 },
    { header: "Date", accessor: "date", render: (r) => formatDate(r.checkIn), width: 120 },
    { header: "In Time", accessor: "inTime", render: (r) => formatTime(r.checkIn), width: 110 },
    { header: "Out Time", accessor: "outTime", render: (r) => formatTime(r.checkOut), width: 110 },
  ];

  const actions = [
    {
      label: "Check Out",
      icon: LogOut,
      onClick: (row) => {
        if (row.checkOut) {
          setActionError("Visitor already checked out.");
          return;
        }
        runAction(() => apiService.frontOffice.visitors.checkout(row.id));
      },
    },
    { label: "Edit Entry", icon: Edit2, onClick: (row) => openForm(row) },
    {
      label: "Delete Log",
      icon: Trash2,
      variant: "danger",
      onClick: (row) => {
        if (window.confirm(`Delete visitor entry for ${row.visitorName}?`)) {
          runAction(() => apiService.frontOffice.visitors.remove(row.id));
        }
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Visitors Today" value={todays.length.toString()} icon={<Users size={20} />} color="indigo" />
        <StatCard title="Currently In Campus" value={visitors.filter((v) => !v.checkOut).length.toString()} icon={<DoorOpen size={20} />} color="amber" />
        <StatCard title="Checked Out Today" value={todays.filter((v) => v.checkOut).length.toString()} icon={<DoorClosed size={20} />} color="emerald" />
      </div>

      <FilterBar
        title="Search Visitor Log"
        description="Filter visitors by name, ID, or purpose."
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
              placeholder="ID, Name or Phone..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className={`${filterClass} pl-10`}
            />
          </div>
        </FilterItem>
        <FilterItem label="Purpose">
          <select value={filters.purpose} onChange={(e) => setFilters({ ...filters, purpose: e.target.value })} className={filterClass}>
            <option>All</option>
            {purposes.map((p) => <option key={p}>{p}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Date Range">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} className={filterClass} />
            <input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} className={filterClass} />
          </div>
        </FilterItem>
      </FilterBar>

      <SectionCard title="Visitor Log" count={rows.length} onAdd={() => openForm(null)} addLabel="Add Visitor">
        {actionError && <p className="px-6 py-3 text-xs font-medium text-rose-600">{actionError}</p>}
        <LoadState loading={loading} error={error} />
        {!loading && !error && <DataTable columns={columns} data={rows} actions={actions} />}
      </SectionCard>

      <SlideOver isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Visitor" : "Check-in Visitor"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className={labelClass}>Name *</label>
            <input type="text" required value={form.visitorName} onChange={setField("visitorName")} className={fieldClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Purpose *</label>
            <input type="text" required list="visitor-purposes" value={form.purpose} onChange={setField("purpose")} className={fieldClass} />
            <datalist id="visitor-purposes">
              {purposes.map((p) => <option key={p} value={p} />)}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Phone</label>
              <input type="text" value={form.phone} onChange={setField("phone")} className={fieldClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Whom To Meet</label>
              <input type="text" value={form.whomToMeet} onChange={setField("whomToMeet")} className={fieldClass} />
            </div>
          </div>
          {!editingId && <p className="text-xs text-slate-500">Check-in time is recorded automatically.</p>}
          {formError && <p className="text-xs font-medium text-rose-600">{formError}</p>}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 disabled:opacity-60">
              {saving ? "Saving..." : "Save Visitor"}
            </button>
          </div>
        </form>
      </SlideOver>
    </div>
  );
}
