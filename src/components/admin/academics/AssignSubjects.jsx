import React, { useState } from "react";
import { Plus, UserPlus, Trash2, Search, BookOpen } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { subjects } from "../../../mock/academicsData";

const AssignSubjects = () => {
  const [assigned, setAssigned] = useState([
    { id: 1, subject: "Mathematics", teacher: "Mr. Gupta", type: "Theory" },
    { id: 2, subject: "Science", teacher: "Ms. Sharma", type: "Theory/Practical" },
  ]);

  const columns = [
    { header: "Subject", accessor: "subject", render: (row) => <span className="font-bold text-slate-900">{row.subject}</span> },
    { header: "Type", accessor: "type", render: (row) => <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest">{row.type}</span> },
    { header: "Teacher", accessor: "teacher", render: (row) => <span className="font-medium text-slate-600 italic">{row.teacher}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Assign Subjects to Class" description="Select class and section to manage subject-teacher mapping." onFilter={() => {}} onReset={() => {}}>
        <FilterItem label="Class *">
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
             <option value="10">Class 10</option>
          </select>
        </FilterItem>
        <FilterItem label="Section *">
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
             <option value="A">Section A</option>
          </select>
        </FilterItem>
      </FilterBar>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-black text-slate-900 tracking-tight">Assigned Subjects List</h3>
            </div>
            <DataTable columns={columns} data={assigned} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-100 bg-blue-50/30">
              <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                Add Subject Mapping
              </h3>
            </div>
            <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Subject *</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                     {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Teacher *</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                     <option value="Mr. Gupta">Mr. Gupta</option>
                     <option value="Ms. Sharma">Ms. Sharma</option>
                  </select>
               </div>
               <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-4">
                 <Plus size={18} /> Assign Subject
               </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjects;
