import React, { useMemo } from "react";
import { Layers } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice } from "../exam/ModuleState";

const CategoryManagement = () => {
  const { data, loading, error, reload } = useAsync(() => apiService.store.items.list(), []);

  const rows = useMemo(() => {
    const map = new Map();
    (data || []).forEach((item) => {
      const name = item.category || "Uncategorized";
      const entry = map.get(name) || { id: name, name, products: 0, stock: 0 };
      entry.products += 1;
      entry.stock += item.quantity || 0;
      map.set(name, entry);
    });
    return [...map.values()];
  }, [data]);

  const columns = [
    { header: "Category Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Products", accessor: "products", render: (row) => <span className="font-bold text-slate-700">{row.products}</span> },
    { header: "Units in Stock", accessor: "stock", render: (row) => <span className="font-bold text-slate-700">{row.stock}</span> },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/30">
        <Layers size={18} className="text-blue-600" />
        <h3 className="font-black text-slate-900 tracking-tight">Product Categories</h3>
      </div>
      <div className="p-4">
        <Notice>Categories come from the Category field of products. Add a product with a new category to create one.</Notice>
      </div>
      <LoadState loading={loading} error={error} onRetry={reload} />
      {!loading && !error && (rows.length ? <DataTable columns={columns} data={rows} /> : <EmptyState>No categories yet.</EmptyState>)}
    </div>
  );
};

export default CategoryManagement;
