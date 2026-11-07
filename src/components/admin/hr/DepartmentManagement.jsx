import React, { useState } from "react";
import { Plus, Building, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useApiData from "../../../hooks/useApiData";
import { departmentsApi } from "../../../services/api";
import { departmentFromApi } from "../../../utils/mappers";

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20";

const DepartmentManagement = () => {
  const { data: departments, loading, error, reload } = useApiData(
    async () => (await departmentsApi.list()).map(departmentFromApi),
    [],
    []
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      await departmentsApi.create({ departmentName: name.trim(), description: description.trim() || undefined });
      setName("");
      setDescription("");
      reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete department "${row.name}"?`)) return;
    setActionError("");
    try {
      await departmentsApi.remove(row.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
           <h3 className="font-black text-slate-900 tracking-tight">Departments</h3>
         </div>
         {loading && <p className="p-6 text-sm font-medium text-slate-500">Loading departments...</p>}
         {error && <p className="p-6 text-sm font-bold text-rose-600">{error}</p>}
         {!loading && !error && (
           <DataTable
             columns={[
               { header: "Department Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
               { header: "Description", accessor: "description", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.description || "-"}</span> },
             ]}
             data={departments}
             actions={[{ icon: Trash2, label: "Delete", variant: "danger", onClick: handleDelete }]}
           />
         )}
      </div>
      <div className="lg:col-span-1">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-4"><Building size={18} className="text-slate-600"/> Add Department</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} />
               </div>
               {actionError && <p className="text-sm font-bold text-rose-600">{actionError}</p>}
               <button type="submit" disabled={saving} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"><Plus size={18} /> {saving ? "Saving..." : "Save"}</button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
