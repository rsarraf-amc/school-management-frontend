import React, { useMemo } from "react";
import { Bookmark } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice } from "../exam/ModuleState";

const Category = () => {
  const { data, loading, error, reload } = useAsync(() => apiService.library.books.list(), []);

  const rows = useMemo(() => {
    const map = new Map();
    (data || []).forEach((book) => {
      const name = book.category || "Uncategorized";
      const entry = map.get(name) || { id: name, name, titles: 0, copies: 0 };
      entry.titles += 1;
      entry.copies += book.totalCopies || 0;
      map.set(name, entry);
    });
    return [...map.values()];
  }, [data]);

  const columns = [
    { header: "Category Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Titles", accessor: "titles", render: (row) => <span className="font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">{row.titles}</span> },
    { header: "Total Copies", accessor: "copies", render: (row) => <span className="font-bold text-slate-700">{row.copies}</span> },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/30">
        <Bookmark size={18} className="text-slate-600" />
        <h3 className="font-black text-slate-900 tracking-tight">Book Categories</h3>
      </div>
      <div className="p-4">
        <Notice>Categories come from the Category field of books. Add a book with a new category to create one.</Notice>
      </div>
      <LoadState loading={loading} error={error} onRetry={reload} />
      {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} /> : <EmptyState>No categories yet.</EmptyState>)}
    </div>
  );
};

export default Category;
