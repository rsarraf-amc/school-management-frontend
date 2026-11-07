import React, { useState } from "react";
import { Plus, Edit, Trash2, Layers, Grid } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { sections } from "../../../mock/academicsData";
import useApiData from "../../../hooks/useApiData";
import { classesApi } from "../../../services/api";
import { classFromApi } from "../../../utils/mappers";

const ClassSectionManagement = () => {
  const [sectionList] = useState(sections);
  const [activeTab, setActiveTab] = useState("classes");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", fee: "" });
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const { data: classList, loading, error, reload } = useApiData(
    async () => (await classesApi.list()).map(classFromApi),
    [],
    [],
  );

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", fee: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab !== "classes" || saving) return;
    setSaving(true);
    setActionError("");
    try {
      const body = { name: form.name, fee: Number(form.fee) };
      if (editing) {
        await classesApi.update(editing.id, body);
      } else {
        await classesApi.create(body);
      }
      resetForm();
      reload();
    } catch (err) {
      setActionError(err.message || "Failed to save class");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Are you sure you want to delete ${row.name}?`)) return;
    setActionError("");
    try {
      await classesApi.remove(row.id);
      if (editing?.id === row.id) resetForm();
      reload();
    } catch (err) {
      setActionError(err.message || "Failed to delete class");
    }
  };

  const classActions = [
    {
      icon: Edit,
      label: "Edit Class",
      onClick: (row) => {
        setEditing(row);
        setForm({ name: row.name ?? "", fee: row.fee ?? "" });
      },
    },
    { icon: Trash2, label: "Delete", onClick: handleDelete, variant: "danger" },
  ];

  const classColumns = [
    { header: "Class Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Fee", accessor: "fee" },
  ];

  const sectionColumns = [
    { header: "Section Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1 bg-slate-100 w-fit rounded-2xl border border-slate-200">
         <button onClick={() => setActiveTab("classes")} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "classes" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Classes</button>
         <button onClick={() => setActiveTab("sections")} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "sections" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Sections</button>
      </div>

      {activeTab === "sections" && (
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-2xl text-xs font-bold">
          Sections are not yet supported by the backend; this tab shows sample data only.
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-bold">
          {actionError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-black text-slate-900 tracking-tight">{activeTab === "classes" ? "Class List" : "Section List"}</h3>
            </div>
            {activeTab === "classes" && loading ? (
              <div className="p-12 text-center text-slate-500 font-bold text-sm">Loading classes...</div>
            ) : activeTab === "classes" && error ? (
              <div className="p-12 text-center space-y-4">
                <p className="text-rose-600 font-bold text-sm">{error}</p>
                <button onClick={reload} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all">Retry</button>
              </div>
            ) : (
              <DataTable
                columns={activeTab === "classes" ? classColumns : sectionColumns}
                data={activeTab === "classes" ? classList : sectionList}
                actions={activeTab === "classes" ? classActions : []}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-100 bg-indigo-50/30">
              <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                {activeTab === "classes" ? <Layers size={18} className="text-indigo-600" /> : <Grid size={18} className="text-indigo-600" />}
                {editing && activeTab === "classes" ? "Edit" : "Add"} {activeTab === "classes" ? "Class" : "Section"}
              </h3>
            </div>
            <form className="p-6 space-y-4" onSubmit={activeTab === "classes" ? handleSubmit : (e) => e.preventDefault()}>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{activeTab === "classes" ? "Class Name" : "Section Name"} *</label>
                  <input
                    key={activeTab}
                    type="text"
                    required
                    {...(activeTab === "classes" ? { value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) } : {})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                  />
               </div>
               {activeTab === "classes" && (
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Fee *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.fee}
                      onChange={(e) => setForm({ ...form, fee: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
                    />
                 </div>
               )}
               <button type="submit" disabled={saving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed">
                 <Plus size={18} /> {saving ? "Saving..." : `${editing && activeTab === "classes" ? "Update" : "Add"} ${activeTab === "classes" ? "Class" : "Section"}`}
               </button>
               {editing && activeTab === "classes" && (
                 <button type="button" onClick={resetForm} className="w-full py-3 border border-slate-200 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">Cancel Edit</button>
               )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSectionManagement;
