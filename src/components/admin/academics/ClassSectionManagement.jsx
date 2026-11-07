import { useEffect, useState } from "react";
import { Plus, Layers, Grid } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { apiService } from "../../../services/apiService";

const ClassSectionManagement = () => {
  const [classList, setClassList] = useState([]);
  const [activeTab, setActiveTab] = useState("classes");
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiService
      .getAllClasses()
      .then((records) => {
        if (active) setClassList(records);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const createClass = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const createdClass = await apiService.createClass({
        name: name.trim(),
        fee: Number(fee),
      });
      setClassList((records) => [...records, createdClass]);
      setName("");
      setFee("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const classColumns = [
    { header: "Class Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Fee", accessor: "fee", render: (row) => <span className="font-medium text-slate-600">{row.fee}</span> },
  ];

  return (
    <div className="space-y-6">
      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</p>}
      <div className="flex items-center gap-2 p-1 bg-slate-100 w-fit rounded-2xl border border-slate-200">
         <button onClick={() => setActiveTab("classes")} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "classes" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Classes</button>
         <button onClick={() => setActiveTab("sections")} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "sections" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Sections</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-black text-slate-900 tracking-tight">{activeTab === "classes" ? "Class List" : "Section List"}</h3>
            </div>
            {activeTab === "sections" ? (
              <p className="p-6 text-sm text-slate-500">The backend does not provide a separate section management endpoint.</p>
            ) : loading ? (
              <p className="p-6 text-sm font-medium text-slate-500">Loading classes...</p>
            ) : (
              <DataTable columns={classColumns} data={classList} />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-100 bg-indigo-50/30">
              <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                {activeTab === "classes" ? <Layers size={18} className="text-indigo-600" /> : <Grid size={18} className="text-indigo-600" />}
                Add {activeTab === "classes" ? "Class" : "Section"}
              </h3>
            </div>
            {activeTab === "classes" ? <form className="p-6 space-y-4" onSubmit={createClass}>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Class Name *</label>
                  <input type="text" required value={name} onChange={(event) => setName(event.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Fee *</label>
                  <input type="number" min="0" required value={fee} onChange={(event) => setFee(event.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
               </div>
               <button type="submit" disabled={saving} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4 disabled:opacity-60">
                 <Plus size={18} /> {saving ? "Adding..." : "Add Class"}
               </button>
            </form> : <p className="p-6 text-sm text-slate-500">Section records are stored on student profiles; the backend does not provide a separate section management endpoint.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSectionManagement;
