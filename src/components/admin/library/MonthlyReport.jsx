import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, inputClass } from "../exam/ModuleState";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fullName = (s) => (s ? [s.firstName, s.lastName].filter(Boolean).join(" ") : "");

const MonthlyReport = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { data, loading, error, reload } = useAsync(() => apiService.library.issues.list(), []);

  const key = `${year}-${String(month).padStart(2, "0")}`;
  const today = now.toISOString().slice(0, 10);
  const records = (data || []).filter(
    (i) => (i.issueDate || "").startsWith(key) || (i.returnDate || "").startsWith(key),
  );
  const statusOf = (i) => (i.status === "Issued" && i.dueDate < today ? "Overdue" : i.status);
  const years = [...new Set([now.getFullYear(), ...(data || []).map((i) => Number((i.issueDate || "").slice(0, 4))).filter(Boolean)])].sort((a, b) => b - a);

  const columns = [
    { header: "Book Title", accessor: "bookTitle", render: (row) => <span className="font-bold text-slate-900">{row.book?.title || `#${row.bookId}`}</span> },
    { header: "Member ID", accessor: "memberId", render: (row) => <span className="font-medium text-slate-500 text-xs">{row.studentId || row.employeeId}</span> },
    { header: "Member Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{fullName(row.student) || fullName(row.employee) || "-"}</span> },
    { header: "Issue Date", accessor: "issueDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.issueDate}</span> },
    { header: "Return Date", accessor: "returnDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.returnDate || "-"}</span> },
    { header: "Status", accessor: "status", render: (row) => {
      const status = statusOf(row);
      return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          status === "Returned" ? "bg-emerald-50 text-emerald-600" : status === "Overdue" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
        }`}>
          {status}
        </span>
      );
    } },
  ];

  const exportCsv = () => {
    const lines = [["Book", "Member ID", "Member", "Issue Date", "Return Date", "Status"].join(",")].concat(
      records.map((r) =>
        [r.book?.title, r.studentId || r.employeeId, fullName(r.student) || fullName(r.employee), r.issueDate, r.returnDate || "", statusOf(r)]
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    );
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `library-report-${key}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <FilterBar
        title="Monthly Circulation Report"
        description="Filter library transactions by Month and Year."
        onFilter={() => {}}
        onReset={() => { setMonth(now.getMonth() + 1); setYear(now.getFullYear()); }}
      >
        <FilterItem label="Month *">
          <select className={inputClass} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTH_NAMES.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Year *">
          <select className={inputClass} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText size={18} className="text-violet-600" />
            Report Data
          </h3>
          <button type="button" onClick={exportCsv} disabled={!records.length} className="px-6 py-2.5 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all text-sm shadow-lg shadow-violet-100 flex items-center gap-2 disabled:opacity-50">
            <Download size={18} /> Export CSV
          </button>
        </div>
        <LoadState loading={loading} error={error} onRetry={reload} />
        {!loading && !error && (records.length ? <DataTable columns={columns} data={records} /> : <EmptyState>No circulation in this month.</EmptyState>)}
      </div>
    </div>
  );
};

export default MonthlyReport;
