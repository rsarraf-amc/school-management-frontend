import React, { useState } from "react";
import { Plus, Calendar, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { holidaysList } from "../../../mock/academicsData";

const HolidayManagement = () => {
  const [holidays, setHolidays] = useState(holidaysList);

  const columns = [
    { header: "Holiday Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "From", accessor: "from", render: (row) => <span className="font-medium text-slate-600">{row.from}</span> },
    { header: "To", accessor: "to", render: (row) => <span className="font-medium text-slate-600">{row.to}</span> },
    { header: "Description", accessor: "description", render: (row) => <span className="text-slate-500 italic text-sm">{row.description}</span> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-black text-slate-900 tracking-tight">Academic Calendar - Holidays</h3>
          </div>
          <DataTable columns={columns} data={holidays} />
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
          <div className="p-6 border-b border-slate-100 bg-rose-50/30">
            <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Plus size={18} className="text-rose-600" />
              Add Holiday
            </h3>
          </div>
          <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Holiday Title *</label>
              <input type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">From *</label>
                  <input type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">To *</label>
                  <input type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20" />
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
               <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <button type="submit" className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-100 flex items-center justify-center gap-2 mt-4">
              <Calendar size={18} /> Save Holiday
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HolidayManagement;
