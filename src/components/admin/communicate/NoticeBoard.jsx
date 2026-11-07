import React, { useState } from "react";
import { Bell, Save, Edit, Trash2, Megaphone } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { notices } from "../../../mock/communicateData";

const NoticeBoard = () => {
  const columns = [
    { header: "Title", accessor: "title", render: (row) => <span className="font-bold text-slate-900">{row.title}</span> },
    { header: "Event Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Publish Date", accessor: "publishDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.publishDate}</span> },
    { 
      header: "Visible To", 
      accessor: "visibleTo", 
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.visibleTo.map((target, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600">
              {target}
            </span>
          ))}
        </div>
      )
    },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Post Notice Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Megaphone size={18} className="text-indigo-600" /> Post New Notice
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Title *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Event Date</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Publish Date *</label>
                  <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
               </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Visible To *</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Student", "Parent", "Teacher", "Admin"].map((target) => (
                    <label key={target} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-xs font-bold text-slate-600 uppercase">{target}</span>
                    </label>
                  ))}
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Message *</label>
                <textarea rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none focus:ring-2 focus:ring-indigo-500/20"></textarea>
             </div>
             <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4">
                <Save size={18} /> Publish Notice
             </button>
          </form>
        </div>
      </div>

      {/* Notice List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Recent Notices</h3>
            </div>
            <DataTable columns={columns} data={notices} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
