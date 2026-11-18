import React, { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage } from "../exam/ModuleState";

const BookList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(() => apiService.library.books.list(), []);

  const term = searchTerm.toLowerCase();
  const filteredBooks = (data || []).filter(
    (book) =>
      (book.title || "").toLowerCase().includes(term) ||
      (book.isbn || "").toLowerCase().includes(term) ||
      (book.author || "").toLowerCase().includes(term),
  );

  const remove = async (row) => {
    if (!window.confirm(`Delete "${row.title}"?`)) return;
    setActionError("");
    try {
      await apiService.library.books.remove(row.id);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  const columns = [
    { header: "Book Title", accessor: "title", render: (row) => <span className="font-bold text-slate-900">{row.title}</span> },
    { header: "ISBN", accessor: "isbn", render: (row) => <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.isbn || "-"}</span> },
    { header: "Author", accessor: "author", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.author || "-"}</span> },
    { header: "Category", accessor: "category", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.category || "-"}</span> },
    { header: "Qty", accessor: "totalCopies", render: (row) => <span className="font-bold text-slate-700">{row.totalCopies}</span> },
    { header: "Available", accessor: "availableCopies", render: (row) => <span className={`font-bold ${row.availableCopies > 0 ? "text-emerald-600" : "text-rose-600"}`}>{row.availableCopies}</span> },
  ];

  const actions = [{ icon: Trash2, label: "Delete", onClick: remove }];

  return (
    <div className="space-y-6">
      <FilterBar
        title="Library Book Inventory"
        description="Search and manage all books currently in the library system."
        onFilter={() => {}}
        onReset={() => setSearchTerm("")}
      >
        <FilterItem label="Search Book">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Title, ISBN or author..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </FilterItem>
      </FilterBar>

      {actionError && <Notice tone="error">{actionError}</Notice>}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Book List</h3>
        </div>
        <LoadState loading={loading} error={error} onRetry={reload} />
        {!loading && !error && (filteredBooks.length ? <DataTable columns={columns} data={filteredBooks} actions={actions} /> : <EmptyState>No books found.</EmptyState>)}
      </div>
    </div>
  );
};

export default BookList;
