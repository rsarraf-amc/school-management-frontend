import React, { useMemo, useState } from "react";
import { Download, FileText, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, inputClass } from "./TransportState";

const TransportReport = () => {
  const { data, loading, error, reload } = useAsync(async () => {
    const [assignments, routes] = await Promise.all([
      apiService.transport.assignments.list(),
      apiService.transport.routes.list(),
    ]);
    return { assignments, routes };
  }, { assignments: [], routes: [] });
  const [filters, setFilters] = useState({ class: "", section: "", routeId: "" });
  const [applied, setApplied] = useState(filters);
  const [actionError, setActionError] = useState("");

  const { assignments, routes } = data;
  const classOptions = useMemo(() => [...new Set(assignments.map((a) => a.student?.class).filter(Boolean))].sort(), [assignments]);
  const sectionOptions = useMemo(() => [...new Set(assignments.map((a) => a.student?.section).filter(Boolean))].sort(), [assignments]);

  const rows = assignments.filter(
    (a) =>
      (!applied.class || a.student?.class === applied.class) &&
      (!applied.section || a.student?.section === applied.section) &&
      (!applied.routeId || String(a.routeId) === applied.routeId),
  );

  const handleRemove = async (row) => {
    if (!window.confirm("Remove this transport assignment?")) return;
    try {
      await apiService.transport.assignments.remove(row.id);
      await reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { header: "Class", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.student?.class || "—"}{row.student?.section ? ` (${row.student.section})` : ""}</span> },
    { header: "Admission No", accessor: "admissionNo", render: (row) => <span className="font-bold text-slate-900">{row.student?.admissionNumber || "—"}</span> },
    { header: "Student Name", accessor: "studentName", render: (row) => <span className="font-bold text-slate-700">{[row.student?.firstName, row.student?.lastName].filter(Boolean).join(" ") || row.studentId}</span> },
    { header: "Route", accessor: "routeTitle", render: (row) => <span className="font-medium text-slate-600">{row.route?.routeName || "—"}</span> },
    { header: "Pickup", accessor: "pickupPoint", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.pickupPoint || "—"}</span> },
    { header: "Vehicle No", accessor: "vehicleNo", render: (row) => <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.route?.vehicle?.vehicleNumber || "—"}</span> },
    { header: "Fare", accessor: "fare", render: (row) => <span className="font-bold text-indigo-600">₹{row.route?.fare ?? 0}</span> },
  ];

  const actions = [{ icon: Trash2, label: "Remove", onClick: handleRemove }];

  const update = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="space-y-6">
      <FilterBar
        title="Transport Report"
        description="Filter transport allocations by Class, Section or Route."
        onFilter={() => setApplied(filters)}
        onReset={() => {
          const cleared = { class: "", section: "", routeId: "" };
          setFilters(cleared);
          setApplied(cleared);
        }}
      >
        <FilterItem label="Class">
          <select value={filters.class} onChange={update("class")} className={inputClass}>
            <option value="">All Classes</option>
            {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Section">
          <select value={filters.section} onChange={update("section")} className={inputClass}>
            <option value="">All Sections</option>
            {sectionOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Route">
          <select value={filters.routeId} onChange={update("routeId")} className={inputClass}>
            <option value="">All Routes</option>
            {routes.map((r) => <option key={r.id} value={r.id}>{r.routeName}</option>)}
          </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-violet-600" />
            Student Transport Report
          </h3>
          <button type="button" onClick={() => window.print()} className="px-6 py-2.5 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all text-sm shadow-lg shadow-violet-100 flex items-center gap-2">
            <Download size={18} /> Print / Save PDF
          </button>
        </div>
        {actionError && <p className="px-6 py-3 text-xs font-medium text-rose-600">{actionError}</p>}
        <LoadState loading={loading} error={error} />
        {!loading && !error && <DataTable columns={columns} data={rows} actions={actions} />}
      </div>
    </div>
  );
};

export default TransportReport;
