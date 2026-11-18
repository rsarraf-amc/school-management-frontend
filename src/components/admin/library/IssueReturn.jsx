import React, { useState } from "react";
import { Repeat, Check } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage, inputClass, labelClass } from "../exam/ModuleState";

const todayStr = () => new Date().toISOString().slice(0, 10);
const fullName = (s) => (s ? [s.firstName, s.lastName].filter(Boolean).join(" ") : "");

const issueStatus = (issue) =>
  issue.status === "Issued" && issue.dueDate < todayStr() ? "Overdue" : issue.status;

const emptyForm = () => ({ studentId: "", bookId: "", issueDate: todayStr(), dueDate: "" });

const IssueReturn = () => {
  const [form, setForm] = useState(emptyForm());
  const [statusFilter, setStatusFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const { data, loading, error, reload } = useAsync(async () => {
    const [issues, books, students] = await Promise.all([
      apiService.library.issues.list(),
      apiService.library.books.list(),
      apiService.getAllStudents(),
    ]);
    return { issues, books, students };
  });

  const issues = data?.issues || [];
  const books = data?.books || [];
  const students = data?.students || [];
  const rows = issues.filter((i) => !statusFilter || issueStatus(i) === statusFilter);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiService.library.issues.create({
        studentId: form.studentId,
        bookId: Number(form.bookId),
        issueDate: form.issueDate,
        dueDate: form.dueDate,
      });
      setForm(emptyForm());
      setMessage({ tone: "success", text: "Book issued." });
      await reload();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const returnBook = async (row) => {
    if (row.status === "Returned") {
      setMessage({ tone: "info", text: "This book was already returned." });
      return;
    }
    setMessage(null);
    try {
      await apiService.library.issues.returnBook(row.id);
      setMessage({ tone: "success", text: "Book returned." });
      await reload();
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    }
  };

  const columns = [
    { header: "Book Title", accessor: "bookTitle", render: (row) => <span className="font-bold text-slate-900">{row.book?.title || `#${row.bookId}`}</span> },
    { header: "Member", accessor: "member", render: (row) => <span className="text-slate-500 font-medium text-xs">{fullName(row.student) || fullName(row.employee) || row.studentId || row.employeeId}</span> },
    { header: "Issue Date", accessor: "issueDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.issueDate}</span> },
    { header: "Due Date", accessor: "dueDate", render: (row) => <span className="font-bold text-slate-700">{row.dueDate}</span> },
    { header: "Return Date", accessor: "returnDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.returnDate || "-"}</span> },
    { header: "Fine", accessor: "fine", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.fine || 0}</span> },
    { header: "Status", accessor: "status", render: (row) => {
      const status = issueStatus(row);
      return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          status === "Returned" ? "bg-emerald-50 text-emerald-600" : status === "Overdue" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
        }`}>
          {status}
        </span>
      );
    } },
  ];

  const actions = [
    { icon: Check, label: "Return Book", onClick: returnBook },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
            <Repeat size={18} className="text-emerald-600" /> Issue Book
          </h3>
          <form className="space-y-4" onSubmit={submit}>
            {message && <Notice tone={message.tone}>{message.text}</Notice>}
            <div className="space-y-2">
              <label className={labelClass}>Student *</label>
              <select required className={inputClass} value={form.studentId} onChange={set("studentId")}>
                <option value="">Select student</option>
                {students.map((s) => <option key={s.id} value={s.id}>{fullName(s)} ({s.id})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Book *</label>
              <select required className={inputClass} value={form.bookId} onChange={set("bookId")}>
                <option value="">Select book</option>
                {books.filter((b) => b.availableCopies > 0).map((b) => <option key={b.id} value={b.id}>{b.title} ({b.availableCopies} available)</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Issue Date *</label>
              <input required type="date" className={inputClass} value={form.issueDate} onChange={set("issueDate")} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Due Date *</label>
              <input required type="date" min={form.issueDate} className={inputClass} value={form.dueDate} onChange={set("dueDate")} />
            </div>
            <button type="submit" disabled={saving} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
              <Repeat size={18} /> {saving ? "Processing..." : "Process Issue"}
            </button>
          </form>
        </div>
      </div>

      <div className="xl:col-span-2 space-y-6">
        <FilterBar
          title="Current Circulation"
          description="View currently issued and overdue books."
          onFilter={() => {}}
          onReset={() => setStatusFilter("")}
        >
          <FilterItem label="Filter by Status">
            <select className={inputClass} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Issued">Issued</option>
              <option value="Overdue">Overdue</option>
              <option value="Returned">Returned</option>
            </select>
          </FilterItem>
        </FilterBar>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Circulation History</h3>
          </div>
          <LoadState loading={loading} error={error} onRetry={reload} />
          {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} actions={actions} /> : <EmptyState>No circulation records.</EmptyState>)}
        </div>
      </div>
    </div>
  );
};

export default IssueReturn;
