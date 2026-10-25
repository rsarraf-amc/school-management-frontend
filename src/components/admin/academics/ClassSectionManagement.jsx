import React, { useState } from "react";
import { Plus, Edit, Trash2, Layers, Grid } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { classes, sections } from "../../../mock/academicsData";

const ClassSectionManagement = () => {
  const [classList, setClassList] = useState(classes);
  const [sectionList, setSectionList] = useState(sections);
  const [activeTab, setActiveTab] = useState("classes");

  const classColumns = [
    { header: "Class Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Sections", accessor: "sections", render: (row) => (
      <div className="flex gap-2">
        {row.sections.map(s => <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black">{s}</span>)}
      </div>
    )},
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-black text-slate-900 tracking-tight">{activeTab === "classes" ? "Class List" : "Section List"}</h3>
            </div>
            <DataTable 
              columns={activeTab === "classes" ? classColumns : sectionColumns} 
              data={activeTab === "classes" ? classList : sectionList} 
            />
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
            <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{activeTab === "classes" ? "Class Name" : "Section Name"} *</label>
                  <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
               </div>
               {activeTab === "classes" && (
                 <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Sections *</label>
                    <div className="grid grid-cols-3 gap-2">
                       {sections.map(s => (
                         <label key={s.id} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-white transition-all">
                            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-xs font-bold text-slate-700">{s.name}</span>
                         </label>
                       ))}
                    </div>
                 </div>
               )}
               <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4">
                 <Plus size={18} /> Add {activeTab === "classes" ? "Class" : "Section"}
               </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassSectionManagement;
